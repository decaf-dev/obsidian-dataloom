import { createTableState } from "src/data/dashboard-state-factory";
import { CommandUndoError } from "./command-errors";
import CellHeaderUpdateCommand from "./cell-header-update-command";

describe("row-header-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			const command = new CellHeaderUpdateCommand(
				prevState.model.headerCells[0].id,
				"markdown",
				"test"
			);
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should update a cell property when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);

		const command = new CellHeaderUpdateCommand(
			prevState.model.headerCells[0].id,
			"markdown",
			"test"
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.headerCells.length).toEqual(1);
		expect(executeState.model.headerCells[0].markdown).toEqual("test");
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);
		const command = new CellHeaderUpdateCommand(
			prevState.model.headerCells[0].id,
			"markdown",
			"test"
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.headerCells).toEqual(
			prevState.model.headerCells
		);
	});
});
