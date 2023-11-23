import CommandUndoError from "./command-undo-error";
import CellBodyUpdateCommand from "./cell-body-update-command";
import { advanceBy, clear } from "jest-date-mock";
import { createLoomState } from "../loom-state-factory";
import { TextCell } from "../types/loom-state";

describe("cell-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		const prevState = createLoomState(1, 1);
		const command = new CellBodyUpdateCommand(
			prevState.model.rows[0].cells[0].id,
			{
				content: "test",
			}
		);

		try {
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

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

	it("should reset the cell property when undo() is called", () => {
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
		advanceBy(100);
		const undoState = command.undo(executeState);
		clear();

		//Assert
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("should update the cell property when redo() is called", () => {
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
		advanceBy(100);
		const undoState = command.undo(executeState);
		advanceBy(100);
		const redoState = command.redo(undoState);
		clear();

		//Assert
		expect(executeState.model.rows).toEqual(redoState.model.rows);
	});
});
