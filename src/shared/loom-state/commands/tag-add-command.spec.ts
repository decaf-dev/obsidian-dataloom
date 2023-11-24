import {
	createColumn,
	createGenericLoomState,
	createMultiTagCell,
	createRow,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import TagAddCommand from "./tag-add-command";
import { Color, Column, MultiTagCell, Row } from "../types/loom-state";
import { advanceBy, clear } from "jest-date-mock";

//TODO add tests for single tag
describe("tag-add-command", () => {
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
		];
		const state = createGenericLoomState({
			columns,
			rows,
		});
		return state;
	};

	it("should add a tag when execute() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test3",
			Color.BLUE
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns[0].tags.length).toEqual(3);
		expect(executeState.model.columns[0].tags).toContain(
			prevState.model.columns[0].tags[0]
		);
		expect(executeState.model.columns[0].tags).toContain(
			prevState.model.columns[0].tags[1]
		);

		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds.length
		).toEqual(1);
		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).not.toContain(prevState.model.columns[0].tags[0].id);
		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).not.toContain(prevState.model.columns[0].tags[1].id);

		const executeLastEditedTime = new Date(
			executeState.model.rows[0].lastEditedDateTime
		).getTime();
		const prevLastEditedTime = new Date(
			prevState.model.rows[0].lastEditedDateTime
		).getTime();

		expect(executeLastEditedTime).toBeGreaterThan(prevLastEditedTime);
	});

	it("should add a multi-tag when execute() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test3",
			Color.BLUE
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns[0].tags.length).toEqual(3);
		expect(executeState.model.columns[0].tags).toContain(
			prevState.model.columns[0].tags[0]
		);
		expect(executeState.model.columns[0].tags).toContain(
			prevState.model.columns[0].tags[1]
		);

		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds.length
		).toEqual(3);
		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).toContain(prevState.model.columns[0].tags[0].id);
		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).toContain(prevState.model.columns[0].tags[1].id);

		const executeLastEditedTime = new Date(
			executeState.model.rows[0].lastEditedDateTime
		).getTime();
		const prevLastEditedTime = new Date(
			prevState.model.rows[0].lastEditedDateTime
		).getTime();

		expect(executeLastEditedTime).toBeGreaterThan(prevLastEditedTime);
	});

	it("should remove the added tag when undo() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test3",
			Color.BLUE
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		advanceBy(100);
		const undoState = command.undo(executeState);
		clear();

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("should restore the added tag when redo() is called", () => {
		//Arrange
		const prevState = initialState();

		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test3",
			Color.BLUE
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
		expect(redoState.model.columns).toEqual(executeState.model.columns);
		expect(redoState.model.rows).toEqual(executeState.model.rows);
	});
});
