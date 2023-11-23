import {
	createColumn,
	createGenericLoomState,
	createMultiTagCell,
	createRow,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import TagCellAddCommand from "./tag-cell-add-command";
import { advanceBy, clear } from "jest-date-mock";
import { Column, MultiTagCell, Row } from "../types/loom-state";

describe("tag-cell-add-command", () => {
	const initialState = () => {
		const columns: Column[] = [
			createColumn({ tags: [createTag("test1"), createTag("test2")] }),
		];
		const rows: Row[] = [
			createRow(0, {
				cells: [
					createMultiTagCell(columns[0].id, {
						tagIds: [columns[0].tags[0].id],
					}),
				],
			}),
			createRow(1, {
				cells: [createMultiTagCell(columns[0].id)],
			}),
		];
		const state = createGenericLoomState({
			columns,
			rows,
		});
		return state;
	};

	it("should add a tag reference to a cell when execute() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagCellAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].tags[1].id
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

		const executeLastEditedTime = new Date(
			executeState.model.rows[0].lastEditedDateTime
		).getTime();
		const prevLastEditedTime = new Date(
			prevState.model.rows[0].lastEditedDateTime
		).getTime();
		expect(executeLastEditedTime).toBeGreaterThan(prevLastEditedTime);
	});

	it("should add a multi-tag reference to a cell when execute() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagCellAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].tags[1].id
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns).toEqual(prevState.model.columns);
		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds
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

	it("should remove the added reference when undo() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagCellAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].tags[1].id
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		advanceBy(100);
		const undoState = command.undo(executeState);
		clear();

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(
			(undoState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).toEqual((prevState.model.rows[0].cells[0] as MultiTagCell).tagIds);
		expect(undoState.model.rows[0].lastEditedDateTime).toEqual(
			prevState.model.rows[0].lastEditedDateTime
		);
	});

	it("should add a tag reference to a cell when redo() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagCellAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].tags[1].id
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
