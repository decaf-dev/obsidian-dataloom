import ColumnUpdateCommand from "./column-update-command";
import { createLoomState } from "../loom-state-factory";

describe("column-update-command", () => {
	it("should update a column property when execute() is called", async () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const command = new ColumnUpdateCommand(prevState.model.columns[0].id, {
			width: "250px",
		});

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].width).toEqual("250px");
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const command = new ColumnUpdateCommand(prevState.model.columns[0].id, {
			width: "250px",
		});

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
	});
});
