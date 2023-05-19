import { createTableState, createTag } from "src/data/table-state-factory";
import { CommandUndoError } from "./command-errors";
import { advanceBy, clear } from "jest-date-mock";
import TagCellMultipleRemoveCommand from "./tag-cell-multiple-remove-command";

describe("tag-cell-remove-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			//Arrange
			const prevState = createTableState(1, 1);

			const tags = [
				createTag(prevState.model.columns[0].id, "test1", {
					cellId: prevState.model.bodyCells[0].id,
				}),
				createTag(prevState.model.columns[0].id, "test2", {
					cellId: prevState.model.bodyCells[0].id,
				}),
			];
			prevState.model.tags = tags;

			const command = new TagCellMultipleRemoveCommand(
				prevState.model.bodyCells[0].id,
				prevState.model.bodyRows[0].id,
				[prevState.model.tags[0].id, prevState.model.tags[1].id]
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
			createTag(prevState.model.columns[0].id, "test1", {
				cellId: prevState.model.bodyCells[0].id,
			}),
			createTag(prevState.model.columns[0].id, "test2", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			[prevState.model.tags[0].id, prevState.model.tags[1].id]
		);

		//Act
		advanceBy(100);
		const executeState = command.execute(prevState);
		clear();

		//Assert
		expect(executeState.model.tags[0].cellIds.length).toEqual(0);
		expect(executeState.model.tags[1].cellIds.length).toEqual(0);
		expect(executeState.model.bodyRows[0].lastEditedTime).toBeGreaterThan(
			prevState.model.bodyRows[0].lastEditedTime
		);
	});

	it("should restore the deleted cell reference when undo() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);

		const tags = [
			createTag(prevState.model.columns[0].id, "test1", {
				cellId: prevState.model.bodyCells[0].id,
			}),
			createTag(prevState.model.columns[0].id, "test2", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;

		const command = new TagCellMultipleRemoveCommand(
			prevState.model.bodyCells[0].id,
			prevState.model.bodyRows[0].id,
			[prevState.model.tags[0].id, prevState.model.tags[1].id]
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
