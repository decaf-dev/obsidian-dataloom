import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import ColumnUpdateCommand from "./column-update-command";

describe("column-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnUpdateCommand(prevState.model.columns[0].id, {
			width: "250px",
		});

		try {
			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnUpdateCommand(prevState.model.columns[0].id, {
			width: "250px",
		});

		try {
			//Act
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should update a column property when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnUpdateCommand(prevState.model.columns[0].id, {
			width: "250px",
		});

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].width).toEqual("250px");
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnUpdateCommand(prevState.model.columns[0].id, {
			width: "250px",
		});

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
	});
});
