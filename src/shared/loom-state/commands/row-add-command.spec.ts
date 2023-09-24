import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import RowAddCommand from "./row-add-command";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";

describe("row-add-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new RowAddCommand();

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
		const command = new RowAddCommand();
		const executeState = command.execute(prevState);

		try {
			//Act
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should add a row when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new RowAddCommand();

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.rows.length).toEqual(2);
		expect(executeState.model.rows[0].cells.length).toEqual(1);
		expect(executeState.model.rows[1].cells.length).toEqual(1);
	});

	it("should remove the added row when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new RowAddCommand();

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});
});
