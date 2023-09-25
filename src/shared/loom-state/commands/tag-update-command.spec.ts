import {
	createTestLoomState,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import TagUpdateCommand from "./tag-update-command";

describe("tag-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagUpdateCommand(
			prevState.model.columns[0].id,
			tags[0].id,
			"content",
			""
		);

		//Act
		try {
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagUpdateCommand(
			prevState.model.columns[0].id,
			tags[0].id,
			"content",
			""
		);

		//Act
		try {
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should update a tag property when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagUpdateCommand(
			prevState.model.columns[0].id,
			tags[0].id,
			"content",
			""
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(executeState.model.columns[0].tags[0].content).toEqual("");
		expect(executeState.model.columns[0].tags[1].content).toEqual("test2");
		expect(executeState.model.rows).toEqual(prevState.model.rows);
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagUpdateCommand(
			prevState.model.columns[0].id,
			tags[0].id,
			"content",
			""
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(executeState.model.rows).toEqual(prevState.model.rows);
	});

	it("should update a tag property when redo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 2);

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.rows[0].cells[0].tagIds = tagIds;
		prevState.model.rows[1].cells[0].tagIds = tagIds;

		const command = new TagUpdateCommand(
			prevState.model.columns[0].id,
			tags[0].id,
			"content",
			""
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
