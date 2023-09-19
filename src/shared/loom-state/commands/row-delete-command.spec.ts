import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import RowDeleteCommand from "./row-delete-command";
import CommandArgumentsError from "./command-arguments-error";
import CommandUndoError from "./command-undo-error";

describe("row-delete-command", () => {
	it("should throw an error if no arguments are passed to the command object", () => {
		try {
			new RowDeleteCommand({});
		} catch (err) {
			expect(err).toBeInstanceOf(CommandArgumentsError);
		}
	});

	it("should throw an error when undo() is called before execute()", () => {
		try {
			//Arrange
			const prevState = createTestLoomState(1, 2);
			const command = new RowDeleteCommand({
				last: true,
			});

			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should delete a row when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new RowDeleteCommand({
			id: prevState.model.bodyRows[0].id,
		});

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.bodyRows.length).toEqual(0);
		expect(executeState.model.bodyCells.length).toEqual(0);
	});

	it("should delete the last row when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);
		const command = new RowDeleteCommand({
			last: true,
		});

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.bodyRows[0].id).toEqual(
			prevState.model.bodyRows[0].id
		);
		expect(executeState.model.bodyCells).toEqual(
			prevState.model.bodyCells.slice(0, 1)
		);
	});

	it("should restore the deleted row when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);
		const command = new RowDeleteCommand({
			id: prevState.model.bodyRows[0].id,
		});

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.bodyRows).toEqual(prevState.model.bodyRows);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
	});

	it("should restore the last deleted row when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);
		const command = new RowDeleteCommand({
			last: true,
		});

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.bodyRows).toEqual(prevState.model.bodyRows);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
	});
});
