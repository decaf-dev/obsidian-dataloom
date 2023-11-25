import { createLoomState } from "../loom-state-factory";
import RowInsertCommand from "./row-insert-command";

describe("row-insert-command", () => {
	it("should insert a row above when execute() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const rowId = prevState.model.rows[0].id;
		const command = new RowInsertCommand(rowId, "above");

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.rows.length).toEqual(2); //make sure that the row was added
		expect(executeState.model.rows[0].cells.length).toEqual(1);
		expect(executeState.model.rows[1].cells.length).toEqual(1);
		expect(executeState.model.rows[1].id).toEqual(rowId); //make sure that the row was added above the original row
		expect(executeState.model.rows[1].index).toEqual(1);
	});

	it("should insert a row below when execute() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const rowId = prevState.model.rows[0].id;
		const command = new RowInsertCommand(rowId, "below");

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.rows.length).toEqual(2); //make sure that the row was added
		expect(executeState.model.rows[0].cells.length).toEqual(1);
		expect(executeState.model.rows[1].cells.length).toEqual(1);
		expect(executeState.model.rows[0].id).toEqual(rowId); //make sure that the row was added below the original row
		expect(executeState.model.rows[0].index).toEqual(0);
	});
});
