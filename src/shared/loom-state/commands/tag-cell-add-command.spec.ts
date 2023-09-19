import {
	createTestLoomState,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import TagCellAddCommand from "./tag-cell-add-command";
import { advanceBy, clear } from "jest-date-mock";

describe("tag-cell-add-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		prevState.model.bodyCells[0].tagIds = [tags[0].id];

		const command = new TagCellAddCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			tags[1].id,
			false
		);

		try {
			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		try {
			//Arrange
			const prevState = createTestLoomState(1, 1);

			const tags = [createTag("test1"), createTag("test2")];
			prevState.model.columns[0].tags = tags;

			prevState.model.bodyCells[0].tagIds = [tags[0].id];

			const command = new TagCellAddCommand(
				prevState.model.bodyCells[0].id,
				prevState.model.bodyRows[0].id,
				tags[1].id,
				false
			);

			//Act
			const executeState = command.execute(prevState);
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should add a cell reference to a tag when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		prevState.model.bodyCells[0].tagIds = [tags[0].id];

		const command = new TagCellAddCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			tags[1].id,
			false
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns).toEqual(prevState.model.columns);
		expect(executeState.model.bodyCells[0].tagIds).toEqual([tags[1].id]);
		expect(executeState.model.bodyRows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});

	it("should add a cell reference to a multi-tag when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		prevState.model.bodyCells[0].tagIds = [tags[0].id];

		const command = new TagCellAddCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			tags[1].id,
			true
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns).toEqual(prevState.model.columns);
		expect(executeState.model.bodyCells[0].tagIds).toEqual([
			tags[0].id,
			tags[1].id,
		]);
		expect(executeState.model.bodyRows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});

	it("should remove the added reference when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		prevState.model.bodyCells[0].tagIds = [tags[0].id];

		const command = new TagCellAddCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			tags[1].id,
			false
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells[0].tagIds).toEqual(
			prevState.model.bodyCells[0].tagIds
		);
		expect(undoState.model.bodyRows[0].lastEditedTime).toEqual(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});
});
