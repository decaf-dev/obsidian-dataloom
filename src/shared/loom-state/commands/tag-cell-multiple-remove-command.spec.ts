import {
	createColumn,
	createGenericLoomState,
	createMultiTagCell,
	createRow,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import { advanceBy, clear } from "jest-date-mock";
import TagCellMultipleRemoveCommand from "./tag-cell-multiple-remove-command";
import { Column, MultiTagCell, Row } from "../types/loom-state";

describe("tag-cell-multiple-remove-command", () => {
	const initialState = () => {
		const columns: Column[] = [
			createColumn({ tags: [createTag("test1"), createTag("test2")] }),
		];
		const rows: Row[] = [
			createRow(0, {
				cells: [
					createMultiTagCell(columns[0].id, {
						tagIds: [columns[0].tags[0].id, columns[0].tags[1].id],
					}),
				],
			}),
			createRow(1, {
				cells: [
					createMultiTagCell(columns[0].id, {
						tagIds: [columns[0].tags[0].id, columns[0].tags[1].id],
					}),
				],
			}),
		];
		const state = createGenericLoomState({
			columns,
			rows,
		});
		return state;
	};
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			[prevState.model.columns[0].tags[0].id]
		);

		try {
			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should delete a cell reference when execute() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			[prevState.model.columns[0].tags[0].id]
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns).toEqual(prevState.model.columns);

		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).toEqual([prevState.model.columns[0].tags[1].id]);
		expect(
			(executeState.model.rows[1].cells[0] as MultiTagCell).tagIds
		).toEqual([
			prevState.model.columns[0].tags[0].id,
			prevState.model.columns[0].tags[1].id,
		]);

		const executeLastEditedTime = new Date(
			executeState.model.rows[0].lastEditedDateTime
		).getTime();
		const prevLastEditedTime = new Date(
			prevState.model.rows[0].lastEditedDateTime
		).getTime();
		expect(executeLastEditedTime).toBeGreaterThan(prevLastEditedTime);
	});

	it("should restore the deleted cell reference when undo() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			[prevState.model.columns[0].tags[0].id]
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("should delete a cell reference when redo() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			[prevState.model.columns[0].tags[0].id]
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
		expect(executeState.model.columns).toEqual(redoState.model.columns);
		expect(executeState.model.rows).toEqual(redoState.model.rows);
	});
});
