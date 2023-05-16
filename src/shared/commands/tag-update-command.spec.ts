import { createTableState, createTag } from "src/data/table-state-factory";
import { CommandRedoError, CommandUndoError } from "./command-errors";
import TagUpdateCommand from "./tag-update-command";

describe("tag-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			//Arrange
			const prevState = createTableState(1, 1);

			const tag = createTag(prevState.model.columns[0].id, "test");
			prevState.model.tags.push(tag);

			const command = new TagUpdateCommand(tag.id, "markdown", "");

			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before redo()", () => {
		try {
			//Arrange
			const prevState = createTableState(1, 1);

			const tag = createTag(prevState.model.columns[0].id, "test");
			prevState.model.tags.push(tag);

			const command = new TagUpdateCommand(tag.id, "markdown", "");

			//Act
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should update a tag property when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
		const tag = createTag(prevState.model.columns[0].id, "test");
		prevState.model.tags.push(tag);
		const command = new TagUpdateCommand(tag.id, "markdown", "");

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.tags.length).toEqual(1);
		expect(executeState.model.tags[0].markdown).toEqual("");
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);

		const tag = createTag(prevState.model.columns[0].id, "test");
		prevState.model.tags.push(tag);

		const command = new TagUpdateCommand(tag.id, "markdown", "");

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.tags.length).toEqual(1);
		expect(undoState.model.tags[0].markdown).toEqual("test");
	});
});
