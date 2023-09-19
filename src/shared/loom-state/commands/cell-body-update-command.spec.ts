import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CellBodyUpdateCommand from "./cell-body-update-command";
import { advanceBy, clear } from "jest-date-mock";

describe("row-body-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			"markdown",
			"test"
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
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			"markdown",
			"test"
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.bodyRows.length).toEqual(1);
		expect(executeState.model.bodyCells.length).toEqual(1);
		expect(executeState.model.bodyCells[0].markdown).toEqual("test");
		expect(executeState.model.bodyRows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			"markdown",
			"test"
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.bodyRows).toEqual(prevState.model.bodyRows);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
	});
});
