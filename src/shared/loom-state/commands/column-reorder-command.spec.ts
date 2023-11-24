import ColumnReorderCommand from "./column-reorder-command";
import { createLoomState } from "../loom-state-factory";

describe("column-update-command", () => {
	it("moves the last column to the first column index when execute() is called", async () => {
		//Arrange
		const prevState = createLoomState(3, 1);
		const firstColumn = prevState.model.columns[0].id;
		const lastColumn = prevState.model.columns[2].id;
		const command = new ColumnReorderCommand(lastColumn, firstColumn);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns[0].id).toEqual(lastColumn);
		expect(executeState.model.columns[1].id).toEqual(firstColumn);
		expect(executeState.model.columns[2].id).toEqual(
			prevState.model.columns[1].id
		);
	});

	it("updates the column order to the original order when undo() is called", () => {
		//Arrange
		const prevState = createLoomState(3, 1);
		const firstColumn = prevState.model.columns[0].id;
		const lastColumn = prevState.model.columns[2].id;
		const command = new ColumnReorderCommand(lastColumn, firstColumn);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
	});

	it("updates the column order to the modified order when redo() is called", () => {
		//Arrange
		const prevState = createLoomState(3, 1);
		const firstColumn = prevState.model.columns[0].id;
		const lastColumn = prevState.model.columns[2].id;
		const command = new ColumnReorderCommand(lastColumn, firstColumn);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.columns).toEqual(executeState.model.columns);
	});
});
