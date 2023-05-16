import { createTableState, createTag } from "src/data/table-state-factory";
import RowDeleteCommand from "./row-delete-command";
import { CommandUndoError } from "./command-errors";
import TagCellRemoveCommand from "./tag-cell-remove-command";
import { advanceBy, clear } from "jest-date-mock";

describe("tag-cell-remove-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			//Arrange
			const prevState = createTableState(1, 1);

			const tags = [
				createTag(prevState.model.columns[0].id, "test", {
					cellId: prevState.model.bodyCells[0].id,
				}),
			];
			prevState.model.tags = tags;

			const command = new TagCellRemoveCommand(
				prevState.model.bodyCells[0].id,
				prevState.model.bodyRows[0].id,
				prevState.model.tags[0].id
			);

			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should delete a cell reference when execute() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);

		const tags = [
			createTag(prevState.model.columns[0].id, "test", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;

		const command = new TagCellRemoveCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			prevState.model.tags[0].id
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.tags[0].cellIds.length).toEqual(0);
		expect(executeState.model.bodyRows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});

	it("should restore the deleted cell reference when undo() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);

		const tags = [
			createTag(prevState.model.columns[0].id, "test", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;

		const command = new TagCellRemoveCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			prevState.model.tags[0].id
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.bodyRows[0].lastEditedTime).toEqual(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});
});
