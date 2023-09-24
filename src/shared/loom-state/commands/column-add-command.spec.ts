import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import ColumnAddCommand from "./column-add-command";

describe("column-add-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnAddCommand();

		try {
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnAddCommand();
		const executeState = command.execute(prevState);

		try {
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should add a column when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnAddCommand();

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(2);
		expect(executeState.model.rows[0].cells.length).toEqual(2);
	});

	it("should remove the added column when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnAddCommand();

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});
});
