import { createTableState } from "src/data/table-state-factory";
import { CommandUndoError } from "./command-errors";
import CellFooterUpdateCommand from "./cell-footer-update-command";
import { GeneralFunction } from "../types/types";

describe("row-footer-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			const command = new CellFooterUpdateCommand(
				prevState.model.footerCells[0].id,
				"functionType",
				GeneralFunction.COUNT_ALL
			);
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should update a cell property when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
		const command = new CellFooterUpdateCommand(
			prevState.model.footerCells[0].id,
			"functionType",
			GeneralFunction.COUNT_ALL
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.footerCells.length).toEqual(2);
		expect(executeState.model.footerCells[0].functionType).toEqual(
			GeneralFunction.COUNT_ALL
		);
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);
		const command = new CellFooterUpdateCommand(
			prevState.model.footerCells[0].id,
			"functionType",
			GeneralFunction.COUNT_ALL
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.footerCells).toEqual(
			prevState.model.footerCells
		);
	});
});
