import { createTableState } from "src/data/table-state-factory";
import { CommandUndoError } from "./command-errors";
import CellFooterUpdateCommand from "./cell-footer-update-command";
import { GeneralFunction } from "../table-state/types";

describe("row-footer-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			new CellFooterUpdateCommand(
				prevState.model.footerCells[0].id,
				"functionType",
				GeneralFunction.COUNT_ALL
			).undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should update a cell property when execute() is called", async () => {
		const prevState = createTableState(1, 1);

		const executeState = new CellFooterUpdateCommand(
			prevState.model.footerCells[0].id,
			"functionType",
			GeneralFunction.COUNT_ALL
		).execute(prevState);

		expect(executeState.model.footerCells.length).toEqual(2);
		expect(executeState.model.footerCells[0].functionType).toEqual(
			GeneralFunction.COUNT_ALL
		);
	});

	it("should reset the cell property when undo() is called", () => {
		const prevState = createTableState(1, 1);
		const command = new CellFooterUpdateCommand(
			prevState.model.footerCells[0].id,
			"functionType",
			GeneralFunction.COUNT_ALL
		);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		expect(undoState.model.footerCells).toEqual(
			prevState.model.footerCells
		);
	});
});
