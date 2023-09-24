import {
	createTestLoomState,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import TagAddCommand from "./tag-add-command";
import { Color } from "../types/loom-state";
import { advanceBy, clear } from "jest-date-mock";

describe("tag-add-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test1",
			Color.BLUE,
			true
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
			const command = new TagAddCommand(
				prevState.model.rows[0].cells[0].id,
				prevState.model.columns[0].id,
				"test1",
				Color.BLUE,
				true
			);

			const executeState = command.execute(prevState);

			//Act
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should add a tag when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((tag) => tag.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;

		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test3",
			Color.BLUE,
			false
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns[0].tags.length).toEqual(3);
		expect(executeState.model.columns[0].tags).toContain(tags[0]);
		expect(executeState.model.columns[0].tags).toContain(tags[1]);

		expect(executeState.model.rows[0].cells[0].tagIds.length).toEqual(1);
		expect(executeState.model.rows[0].cells[0].tagIds).not.toContain(
			tags[0].id
		);
		expect(executeState.model.rows[0].cells[0].tagIds).not.toContain(
			tags[1].id
		);
		expect(executeState.model.rows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.rows[0].lastEditedTime
		);
	});

	it("should add a multi-tag when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((tag) => tag.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;

		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test3",
			Color.BLUE,
			true
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.columns[0].tags.length).toEqual(3);
		expect(executeState.model.columns[0].tags).toContain(tags[0]);
		expect(executeState.model.columns[0].tags).toContain(tags[1]);

		expect(executeState.model.rows[0].cells[0].tagIds.length).toEqual(3);
		expect(executeState.model.rows[0].cells[0].tagIds).toContain(
			tags[0].id
		);
		expect(executeState.model.rows[0].cells[0].tagIds).toContain(
			tags[1].id
		);

		expect(executeState.model.rows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.rows[0].lastEditedTime
		);
	});

	it("should remove the added tag when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;

		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test3",
			Color.BLUE,
			true
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
		const prevState = createTestLoomState(1, 1);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;

		const command = new TagAddCommand(
			prevState.model.rows[0].cells[0].id,
			prevState.model.columns[0].id,
			"test3",
			Color.BLUE,
			true
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
