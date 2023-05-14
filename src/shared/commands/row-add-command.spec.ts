import { createTableState } from "src/data/table-state-factory";
import RowAddCommand from "./row-add-command";
import { CommandUndoError } from "./command-errors";

describe("row-add-command", () => {
	let command: RowAddCommand;
	beforeEach(() => {
		command = new RowAddCommand();
	});

	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should add a row when execute() is called", () => {
		const prevState = createTableState(1, 1);
		const executeState = command.execute(prevState);

		expect(executeState.model.bodyRows.length).toEqual(2);
		expect(executeState.model.bodyCells.length).toEqual(2);
	});

	it("should remove the added row when undo() is called", () => {
		const prevState = createTableState(1, 1);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		expect(undoState.model.bodyRows).toEqual(prevState.model.bodyRows);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
	});
});
