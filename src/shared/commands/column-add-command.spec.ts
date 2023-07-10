import { createLoomState } from "src/data/loom-state-factory";
import { CommandRedoError, CommandUndoError } from "./command-errors";
import ColumnAddCommand from "./column-add-command";

describe("column-add-command", () => {
	let command: ColumnAddCommand;
	beforeEach(() => {
		command = new ColumnAddCommand();
	});

	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createLoomState(1, 1);
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		try {
			const prevState = createLoomState(1, 1);
			const executeState = command.execute(prevState);
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should add a column when execute() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(2);
		expect(executeState.model.headerCells.length).toEqual(2);
		expect(executeState.model.bodyCells.length).toEqual(2);
		expect(executeState.model.footerCells.length).toEqual(4);
	});

	it("should remove the added column when undo() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.headerCells).toEqual(
			prevState.model.headerCells
		);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.footerCells).toEqual(
			prevState.model.footerCells
		);
	});
});
