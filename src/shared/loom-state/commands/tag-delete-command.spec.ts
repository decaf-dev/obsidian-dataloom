import {
	createTestLoomState,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import TagDeleteCommand from "./tag-delete-command";

describe("tag-delete-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
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
			const prevState = createTestLoomState(1, 2);

			const tags = [createTag("test1"), createTag("test2")];
			prevState.model.columns[0].tags = tags;

			const tagIds = tags.map((t) => t.id);
			prevState.model.rows[0].cells[0].tagIds = tagIds;
			prevState.model.rows[1].cells[0].tagIds = tagIds;

			const command = new TagDeleteCommand(
				prevState.model.columns[0].id,
				tags[0].id
			);

			//Act
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should delete a tag when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns[0].tags).toEqual([tags[1]]);
		expect(executeState.model.rows[0].cells[0].tagIds).toEqual([
			tags[1].id,
		]);
		expect(executeState.model.rows[1].cells[0].tagIds).toEqual([
			tags[1].id,
		]);
	});

	it("should restore the deleted tag when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("should delete a tag when redo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(executeState.model.columns).toEqual(redoState.model.columns);
		expect(executeState.model.rows).toEqual(redoState.model.rows);
	});
});
