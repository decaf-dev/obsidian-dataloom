import { createTableState } from "src/data/table-state-factory";
import { CommandRedoError, CommandUndoError } from "./command-errors";
import ColumnUpdateCommand from "./column-update-command";

describe("column-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			new ColumnUpdateCommand(
				prevState.model.columns[0].id,
				"width",
				"250px"
			).undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before redo()", () => {
		try {
			const prevState = createTableState(1, 1);
			const command = new ColumnUpdateCommand(
				prevState.model.columns[0].id,
				"width",
				"250px"
			);
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should update a column property when execute() is called", async () => {
		const prevState = createTableState(1, 1);

		const executeState = new ColumnUpdateCommand(
			prevState.model.columns[0].id,
			"width",
			"250px"
		).execute(prevState);

		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].width).toEqual("250px");
	});

	it("should reset the cell property when undo() is called", () => {
		const prevState = createTableState(1, 1);
		const command = new ColumnUpdateCommand(
			prevState.model.columns[0].id,
			"width",
			"250px"
		);

		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		expect(undoState.model.columns.length).toEqual(1);
		expect(undoState.model.columns[0].width).toEqual("140px");
	});
});
