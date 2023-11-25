import RowAddCommand from "./row-add-command";
import { createLoomState } from "../loom-state-factory";

describe("row-add-command", () => {
	it("should add a row when execute() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const command = new RowAddCommand();

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.rows.length).toEqual(2);
		expect(executeState.model.rows[0].cells.length).toEqual(1);
		expect(executeState.model.rows[1].cells.length).toEqual(1);
	});
});
