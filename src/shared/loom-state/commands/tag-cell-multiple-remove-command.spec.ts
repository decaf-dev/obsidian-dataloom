import {
	createTestLoomState,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import { advanceBy, clear } from "jest-date-mock";
import TagCellMultipleRemoveCommand from "./tag-cell-multiple-remove-command";

describe("tag-cell-multiple-remove-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			[tags[0].id]
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
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			[tags[0].id]
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns).toEqual(prevState.model.columns);

		expect(executeState.model.rows[0].cells[0].tagIds).toEqual([
			tags[1].id,
		]);
		expect(executeState.model.rows[1].cells[0].tagIds).toEqual([
			tags[0].id,
			tags[1].id,
		]);
		expect(executeState.model.rows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.rows[0].lastEditedTime
		);
	});

	it("should restore the deleted cell reference when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			[tags[0].id]
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
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.rows[0].cells[0].id,
			[tags[0].id]
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
