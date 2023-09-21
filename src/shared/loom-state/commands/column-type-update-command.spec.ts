import {
	createTestLoomState,
	createTag,
	createTextFilter,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import { ColumnTypeUpdateCommand } from "./column-type-update-command";
import { CellType } from "../types/loom-state";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "../../constants";

describe("column-type-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		const prevState = createTestLoomState(1, 1);

		try {
			new ColumnTypeUpdateCommand(
				prevState.model.columns[0].id,
				CellType.TAG
			).undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);
		command.execute(prevState);

		try {
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should handle multi-tag -> text when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 2, {
			cellType: CellType.MULTI_TAG,
		});
		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(executeState.model.bodyCells[0].tagIds).toEqual([]);
		expect(executeState.model.bodyCells[1].tagIds).toEqual([]);
	});

	it("should handle tag -> text when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 2, {
			cellType: CellType.TAG,
		});

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(executeState.model.bodyCells[0].tagIds).toEqual([]);
		expect(executeState.model.bodyCells[1].tagIds).toEqual([]);
	});

	it("should handle text -> tag when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		prevState.model.bodyCells[0].markdown = "test1,test2";
		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TAG);
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(executeState.model.columns[0].tags[0].markdown).toEqual("test1");
		expect(executeState.model.columns[0].tags[1].markdown).toEqual("test2");
		expect(executeState.model.bodyCells[0].tagIds.length).toEqual(1);
	});

	it("should handle text -> multi-tag when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		prevState.model.bodyCells[0].markdown = "test1,test2";
		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.MULTI_TAG
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.MULTI_TAG);
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(executeState.model.columns[0].tags[0].markdown).toEqual("test1");
		expect(executeState.model.columns[0].tags[1].markdown).toEqual("test2");
		expect(executeState.model.bodyCells[0].tagIds.length).toEqual(2);
	});

	it("should handle multi-tag -> tag when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 2, {
			cellType: CellType.MULTI_TAG,
		});

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TAG);
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(executeState.model.bodyCells[0].tagIds.length).toEqual(1);
	});

	it("should handle text -> checkbox when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.CHECKBOX
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.CHECKBOX);
		expect(executeState.model.bodyCells[0].markdown).toEqual(
			CHECKBOX_MARKDOWN_UNCHECKED
		);
	});

	it("should handle date -> text when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1, {
			cellType: CellType.DATE,
		});
		prevState.model.bodyCells[0].dateTime = new Date(
			"2020-01-01"
		).getTime();

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(executeState.model.bodyCells[0].markdown).toEqual("12/31/2019");
	});

	it("should delete referenced filters when execute() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1, {
			cellType: CellType.TEXT,
		});

		const filters = [
			createTextFilter(prevState.model.columns[0].id),
			createTextFilter(prevState.model.columns[0].id),
		];
		prevState.model.filters = filters;

		//Act
		const executeState = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		).execute(prevState);

		//Assert
		expect(executeState.model.filters).toEqual([]);
	});

	it("should handle multi-tag -> text when undo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 2, {
			cellType: CellType.MULTI_TAG,
		});

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should handle tag -> text when undo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 2, {
			cellType: CellType.TAG,
		});

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;
		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should handle text -> tag when undo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		prevState.model.bodyCells[0].markdown = "test1,test2";

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should handle text -> multi-tag when undo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		prevState.model.bodyCells[0].markdown = "test1,test2";

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.MULTI_TAG
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should handle multi-tag -> tag when undo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 2, {
			cellType: CellType.MULTI_TAG,
		});

		const tags = [createTag("test1"), createTag("test2")];
		prevState.model.columns[0].tags = tags;

		const tagIds = tags.map((t) => t.id);
		prevState.model.bodyCells[0].tagIds = tagIds;
		prevState.model.bodyCells[1].tagIds = tagIds;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should handle text -> checkbox when undo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.CHECKBOX
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should handle date -> text when undo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1, {
			cellType: CellType.DATE,
		});
		prevState.model.bodyCells[0].dateTime = new Date(
			"2020-01-01"
		).getTime();

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should restore deleted filters when undo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1, {
			cellType: CellType.TEXT,
		});

		const filters = [
			createTextFilter(prevState.model.columns[0].id),
			createTextFilter(prevState.model.columns[0].id),
		];
		prevState.model.filters = filters;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should handle text -> multi-tag when redo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		prevState.model.bodyCells[0].markdown = "test1,test2";

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.MULTI_TAG
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.columns).toEqual(executeState.model.columns);
		expect(redoState.model.bodyCells).toEqual(executeState.model.bodyCells);
		expect(redoState.model.filters).toEqual(executeState.model.filters);
	});

	it("should delete filters when redo() is called", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1, {
			cellType: CellType.TEXT,
		});

		const filters = [
			createTextFilter(prevState.model.columns[0].id),
			createTextFilter(prevState.model.columns[0].id),
		];
		prevState.model.filters = filters;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.filters).toEqual(executeState.model.filters);
	});
});
