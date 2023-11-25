import {
	createColumn,
	createGenericLoomState,
	createMultiTagCell,
	createRow,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import TagCellAddCommand from "./tag-cell-add-command";
import { advanceBy, clear } from "jest-date-mock";
import { CellType, Column, MultiTagCell, Row } from "../types/loom-state";

describe("tag-cell-add-command", () => {
	//TODO add testing for a tag
	const initialState = () => {
		const columns: Column[] = [
			createColumn({
				type: CellType.MULTI_TAG,
				tags: [createTag("test1"), createTag("test2")],
			}),
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
});
