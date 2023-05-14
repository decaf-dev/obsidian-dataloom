import { createTableState } from "src/data/table-state-factory";
import { CommandUndoError } from "./command-errors";
import ColumnAddCommand from "./column-add-command";

describe("column-add-command", () => {
	let command: ColumnAddCommand;
	beforeEach(() => {
		command = new ColumnAddCommand();
	});

	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should add a column when execute() is called", () => {
		const prevState = createTableState(1, 1);
		const executeState = command.execute(prevState);

		expect(executeState.model.columns.length).toEqual(2);
		expect(executeState.model.headerCells.length).toEqual(2);
		expect(executeState.model.bodyCells.length).toEqual(2);
		expect(executeState.model.footerCells.length).toEqual(4);
	});

	it("should remove the added column when undo() is called", () => {
		const prevState = createTableState(1, 1);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

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
