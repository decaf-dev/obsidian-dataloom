import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CellBodyUpdateCommand from "./cell-body-update-command";
import { advanceBy, clear } from "jest-date-mock";

describe("cell-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.rows[0].cells[0].id,
			{
				content: "test",
			}
		);

		try {
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should update a cell property when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.rows[0].cells[0].id,
			{
				content: "test",
			}
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.rows.length).toEqual(1);
		expect(executeState.model.rows[0].cells.length).toEqual(1);
		expect(executeState.model.rows[0].cells[0].content).toEqual("test");
		expect(executeState.model.rows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.rows[0].lastEditedTime
		);
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.rows[0].cells[0].id,
			{
				content: "test",
			}
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		advanceBy(100);
		const undoState = command.undo(executeState);
		clear();

		//Assert
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("should update the cell property when redo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.rows[0].cells[0].id,
			{
				content: "test",
			}
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		advanceBy(100);
		const undoState = command.undo(executeState);
		advanceBy(100);
		const redoState = command.redo(undoState);
		clear();

		//Assert
		expect(executeState.model.rows).toEqual(redoState.model.rows);
	});
});
