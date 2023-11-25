import CellBodyUpdateCommand from "./cell-body-update-command";
import { advanceBy, clear } from "jest-date-mock";
import { createLoomState } from "../loom-state-factory";
import { TextCell } from "../types/loom-state";

describe("cell-update-command", () => {
	it("should update a cell property when execute() is called", async () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.rows[0].cells[0].id,
			{
				content: "test",
			}
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.rows.length).toEqual(1);
		expect(executeState.model.rows[0].cells.length).toEqual(1);
		expect(
			(executeState.model.rows[0].cells[0] as TextCell).content
		).toEqual("test");

		const executeLastEditedDateTime = new Date(
			executeState.model.rows[0].lastEditedDateTime
		).getTime();
		const prevLastEditedDateTime = new Date(
			prevState.model.rows[0].lastEditedDateTime
		).getTime();

		expect(executeLastEditedDateTime).toBeGreaterThan(
			prevLastEditedDateTime
		);
	});
});
