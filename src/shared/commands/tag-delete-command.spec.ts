import { createTableState, createTag } from "src/data/table-state-factory";
import { CommandUndoError, CommandRedoError } from "./command-errors";
import TagDeleteCommand from "./tag-delete-command";

describe("tag-delete-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			//Arrange
			const prevState = createTableState(1, 2);

			const tag = createTag(prevState.model.columns[0].id, "test");
			prevState.model.tags.push(tag);

			const command = new TagDeleteCommand(tag.id);

			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		try {
			//Arrange
			const prevState = createTableState(1, 2);

			const tag = createTag(prevState.model.columns[0].id, "test");
			prevState.model.tags.push(tag);

			const command = new TagDeleteCommand(tag.id);

			//Act
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should delete a tag when execute() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);

		const tag = createTag(prevState.model.columns[0].id, "test");
		prevState.model.tags.push(tag);

		const command = new TagDeleteCommand(tag.id);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.tags.length).toEqual(0);
	});

	it("should restore the deleted tag when undo() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);

		const tag = createTag(prevState.model.columns[0].id, "test");
		prevState.model.tags.push(tag);

		const command = new TagDeleteCommand(tag.id);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.tags).toEqual(prevState.model.tags);
	});
});
