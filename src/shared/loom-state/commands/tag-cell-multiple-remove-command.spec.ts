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
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
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
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			[tags[0].id]
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns).toEqual(prevState.model.columns);

		expect(executeState.model.bodyCells[0].tagIds).toEqual([tags[1].id]);
		expect(executeState.model.bodyCells[1].tagIds).toEqual([
			tags[0].id,
			tags[1].id,
		]);
		expect(executeState.model.bodyRows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});

	it("should restore the deleted cell reference when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			[tags[0].id]
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.bodyRows[0].lastEditedTime).toEqual(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});
});
