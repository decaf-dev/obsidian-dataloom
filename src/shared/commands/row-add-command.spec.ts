import { createLoomState } from "src/data/loom-state-factory";
import RowAddCommand from "./row-add-command";
import { CommandRedoError, CommandUndoError } from "./command-errors";

describe("row-add-command", () => {
	let command: RowAddCommand;
	beforeEach(() => {
		command = new RowAddCommand();
	});

	it("should throw an error when undo() is called before execute()", () => {
		try {
			//Arrange
			const prevState = createLoomState(1, 1);

			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		try {
			//Arrange
			const prevState = createLoomState(1, 1);
			const executeState = command.execute(prevState);

			//Act
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should add a row when execute() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.bodyRows.length).toEqual(2);
		expect(executeState.model.bodyCells.length).toEqual(2);
	});

	it("should remove the added row when undo() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.bodyRows).toEqual(prevState.model.bodyRows);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
	});
});
