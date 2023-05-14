import { createTableState } from "src/data/table-state-factory";
import { CommandUndoError } from "./command-errors";
import CellFooterUpdateCommand from "./cell-footer-update-command";
import { GeneralFunction } from "../table-state/types";
import CellHeaderUpdateCommand from "./cell-header-update-command";

describe("row-header-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			new CellHeaderUpdateCommand(
				prevState.model.headerCells[0].id,
				"markdown",
				"test"
			).undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should update a cell property when execute() is called", async () => {
		const prevState = createTableState(1, 1);

		const executeState = new CellHeaderUpdateCommand(
			prevState.model.headerCells[0].id,
			"markdown",
			"test"
		).execute(prevState);

		expect(executeState.model.headerCells.length).toEqual(1);
		expect(executeState.model.headerCells[0].markdown).toEqual("test");
	});

	it("should reset the cell property when undo() is called", () => {
		const prevState = createTableState(1, 1);
		const command = new CellHeaderUpdateCommand(
			prevState.model.headerCells[0].id,
			"markdown",
			"test"
		);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		expect(undoState.model.headerCells).toEqual(
			prevState.model.headerCells
		);
	});
});
