import { createTableState } from "src/data/table-state-factory";
import { CommandUndoError } from "./command-errors";
import CellBodyUpdateCommand from "./cell-body-update-command";

describe("row-body-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			new CellBodyUpdateCommand(
				prevState.model.bodyCells[0].id,
				prevState.model.bodyRows[0].id,
				"markdown",
				"test"
			).undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should update a cell property when execute() is called", async () => {
		const prevState = createTableState(1, 1);

		//Wait one millis so that the time will be different
		await new Promise((resolve) => setTimeout(resolve, 1));

		const executeState = new CellBodyUpdateCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			"markdown",
			"test"
		).execute(prevState);

		expect(executeState.model.bodyRows.length).toEqual(1);
		expect(executeState.model.bodyCells.length).toEqual(1);
		expect(executeState.model.bodyCells[0].markdown).toEqual("test");
		expect(executeState.model.bodyRows[0].lastEditedTime).not.toEqual(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});

	it("should reset the cell property when undo() is called", () => {
		const prevState = createTableState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			"markdown",
			"test"
		);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		expect(undoState.model.bodyRows).toEqual(prevState.model.bodyRows);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
	});
});
