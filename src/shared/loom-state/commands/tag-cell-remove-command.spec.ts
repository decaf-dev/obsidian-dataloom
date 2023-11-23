import {
	createColumn,
	createGenericLoomState,
	createRow,
	createTag,
	createTagCell,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import TagCellRemoveCommand from "./tag-cell-remove-command";
import { advanceBy, clear } from "jest-date-mock";
import { CellType, TagCell } from "../types/loom-state";

describe("tag-cell-remove-command", () => {
	const createTestState = () => {
		const tags = [createTag("test1"), createTag("test2")];
		const column = createColumn({ type: CellType.TAG, tags });

		const prevState = createGenericLoomState({
			columns: [column],
			rows: [
				createRow(0, {
					cells: [
						createTagCell(column.id, {
							tagId: tags[0].id,
						}),
					],
				}),
				createRow(1, {
					cells: [
						createTagCell(column.id, {
							tagId: tags[1].id,
						}),
					],
				}),
			],
		});
		return { prevState, tags };
	};

	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagCellRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			tags[0].id
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
		const { prevState, tags } = createTestState();

		const command = new TagCellRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			tags[0].id
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns).toEqual(prevState.model.columns);

		expect((executeState.model.rows[0].cells[0] as TagCell).tagId).toEqual(
			tags[1].id
		);
		expect((executeState.model.rows[1].cells[0] as TagCell).tagId).toEqual([
			tags[0].id,
			tags[1].id,
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
		const { prevState, tags } = createTestState();

		const command = new TagCellRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			tags[0].id
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		clear();

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("should delete a cell reference when redo() is called", () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagCellRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			tags[0].id
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
