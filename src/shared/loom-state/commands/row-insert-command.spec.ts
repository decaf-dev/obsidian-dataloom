import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import RowInsertCommand from "./row-insert-command";

describe("row-insert-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);
		const command = new RowInsertCommand(
			prevState.model.rows[0].id,
			"above"
		);

		try {
			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should insert a row above when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const rowId = prevState.model.rows[0].id;
		const command = new RowInsertCommand(rowId, "above");

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.rows.length).toEqual(2); //make sure that the row was added
		expect(executeState.model.rows[0].cells.length).toEqual(1);
		expect(executeState.model.rows[1].cells.length).toEqual(1);
		expect(executeState.model.rows[1].id).toEqual(rowId); //make sure that the row was added above the original row
		expect(executeState.model.rows[1].index).toEqual(1);
	});

	it("should insert a row below when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const rowId = prevState.model.rows[0].id;
		const command = new RowInsertCommand(rowId, "below");

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.rows.length).toEqual(2); //make sure that the row was added
		expect(executeState.model.rows[0].cells.length).toEqual(1);
		expect(executeState.model.rows[1].cells.length).toEqual(1);
		expect(executeState.model.rows[0].id).toEqual(rowId); //make sure that the row was added below the original row
		expect(executeState.model.rows[0].index).toEqual(0);
	});

	it("should delete the row inserted above when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const rowId = prevState.model.rows[0].id;
		const command = new RowInsertCommand(rowId, "above");

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.rows).toEqual(prevState.model.rows); //make sure that nothing has changed
	});

	it("should delete the row inserted below when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const rowId = prevState.model.rows[0].id;
		const command = new RowInsertCommand(rowId, "below");

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.rows).toEqual(prevState.model.rows); //make sure that nothing has changed
	});

	it("should restore the row inserted above when redo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const rowId = prevState.model.rows[0].id;
		const command = new RowInsertCommand(rowId, "above");

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.rows).toEqual(executeState.model.rows);
	});

	it("should restore the row inserted below when redo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const rowId = prevState.model.rows[0].id;
		const command = new RowInsertCommand(rowId, "below");

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.rows).toEqual(executeState.model.rows);
	});
});
