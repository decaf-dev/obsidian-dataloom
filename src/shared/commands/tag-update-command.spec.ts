import { createTableState, createTag } from "src/data/table-state-factory";
import { CommandRedoError, CommandUndoError } from "./command-errors";
import TagUpdateCommand from "./tag-update-command";

describe("tag-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			const tag = createTag(prevState.model.columns[0].id, "test");
			prevState.model.tags.push(tag);
			new TagUpdateCommand(tag.id, "markdown", "").undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before redo()", () => {
		try {
			const prevState = createTableState(1, 1);
			const tag = createTag(prevState.model.columns[0].id, "test");
			prevState.model.tags.push(tag);
			const command = new TagUpdateCommand(tag.id, "markdown", "");
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should update a tag property when execute() is called", async () => {
		const prevState = createTableState(1, 1);
		const tag = createTag(prevState.model.columns[0].id, "test");
		prevState.model.tags.push(tag);

		const executeState = new TagUpdateCommand(
			tag.id,
			"markdown",
			""
		).execute(prevState);

		expect(executeState.model.tags.length).toEqual(1);
		expect(executeState.model.tags[0].markdown).toEqual("");
	});

	it("should reset the cell property when undo() is called", () => {
		const prevState = createTableState(1, 1);
		const tag = createTag(prevState.model.columns[0].id, "test");
		prevState.model.tags.push(tag);
		const command = new TagUpdateCommand(tag.id, "markdown", "");

		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		expect(undoState.model.tags.length).toEqual(1);
		expect(undoState.model.tags[0].markdown).toEqual("test");
	});
});
