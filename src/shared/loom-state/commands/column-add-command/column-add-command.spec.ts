import ColumnAddCommand from ".";
import { createLoomState } from "../../loom-state-factory";

describe("column-add-command", () => {
	it("should add a column when execute() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const command = new ColumnAddCommand();

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(2);
		expect(executeState.model.rows[0].cells.length).toEqual(2);
	});
});
