import {
	createFilterRule,
	createTableState,
	createTag,
} from "src/data/table-state-factory";
import { CommandRedoError, CommandUndoError } from "./command-errors";
import { ColumnTypeUpdateCommand } from "./column-type-update-command";
import { CellType } from "../table-state/types";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "../table-state/constants";

describe("column-type-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(1, 1);
			new ColumnTypeUpdateCommand(
				prevState.model.columns[0].id,
				CellType.TAG
			).undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before redo()", () => {
		try {
			const prevState = createTableState(1, 1);
			const command = new ColumnTypeUpdateCommand(
				prevState.model.columns[0].id,
				CellType.TAG
			);
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should handle multi-tag -> text when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.MULTI_TAG,
		});
		const tags = [
			createTag(prevState.model.columns[0].id, "test1", {
				cellId: prevState.model.bodyCells[0].id,
			}),
			createTag(prevState.model.columns[0].id, "test2", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(executeState.model.tags.length).toEqual(2);
		expect(executeState.model.tags[0].cellIds).toEqual([]);
		expect(executeState.model.tags[1].cellIds).toEqual([]);
	});

	it("should handle tag -> text when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.TAG,
		});
		const tags = [
			createTag(prevState.model.columns[0].id, "test1", {
				cellId: prevState.model.bodyCells[0].id,
			}),
			createTag(prevState.model.columns[0].id, "test2", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;
		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(executeState.model.tags.length).toEqual(2);
		expect(executeState.model.tags[0].cellIds).toEqual([]);
		expect(executeState.model.tags[1].cellIds).toEqual([]);
	});

	it("should handle text -> tag when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
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
		expect(executeState.model.tags.length).toEqual(2);
		expect(executeState.model.tags[0].cellIds.length).toEqual(1);
		expect(executeState.model.tags[1].cellIds.length).toEqual(0);
		expect(executeState.model.tags[0].markdown).toEqual("test1");
		expect(executeState.model.tags[1].markdown).toEqual("test2");
	});

	it("should handle text -> multi-tag when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
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
		expect(executeState.model.tags.length).toEqual(2);
		expect(executeState.model.tags[0].cellIds.length).toEqual(1);
		expect(executeState.model.tags[1].cellIds.length).toEqual(1);
		expect(executeState.model.tags[0].markdown).toEqual("test1");
		expect(executeState.model.tags[1].markdown).toEqual("test2");
	});

	it("should handle multi-tag -> tag when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.MULTI_TAG,
		});
		const tags = [
			createTag(prevState.model.columns[0].id, "test1", {
				cellId: prevState.model.bodyCells[0].id,
			}),
			createTag(prevState.model.columns[0].id, "test2", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;
		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TAG);
		expect(executeState.model.tags.length).toEqual(2);
		expect(executeState.model.tags[0].cellIds.length).toEqual(1);
		expect(executeState.model.tags[1].cellIds.length).toEqual(0);
		expect(executeState.model.tags[0].markdown).toEqual("test1");
		expect(executeState.model.tags[1].markdown).toEqual("test2");
	});

	it("should handle text -> checkbox when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
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
		const prevState = createTableState(1, 1, { cellType: CellType.DATE });
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

	it("should delete referenced filter rules when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.TEXT,
		});

		const filterRules = [
			createFilterRule(prevState.model.columns[0].id),
			createFilterRule(prevState.model.columns[0].id),
		];
		prevState.model.filterRules = filterRules;

		//Act
		const executeState = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		).execute(prevState);

		//Assert
		expect(executeState.model.filterRules).toEqual([]);
	});

	it("should handle multi-tag -> text when undo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.MULTI_TAG,
		});

		const tags = [
			createTag(prevState.model.columns[0].id, "test1", {
				cellId: prevState.model.bodyCells[0].id,
			}),
			createTag(prevState.model.columns[0].id, "test2", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;

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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should handle tag -> text when undo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.TAG,
		});

		const tags = [
			createTag(prevState.model.columns[0].id, "test1", {
				cellId: prevState.model.bodyCells[0].id,
			}),
			createTag(prevState.model.columns[0].id, "test2", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;

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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should handle text -> tag when undo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should handle text -> multi-tag when undo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should handle multi-tag -> tag when undo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.MULTI_TAG,
		});

		const tags = [
			createTag(prevState.model.columns[0].id, "test1", {
				cellId: prevState.model.bodyCells[0].id,
			}),
			createTag(prevState.model.columns[0].id, "test2", {
				cellId: prevState.model.bodyCells[0].id,
			}),
		];
		prevState.model.tags = tags;

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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should handle text -> checkbox when undo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);

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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should handle date -> text when undo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should restore deleted filter rules when undo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.TEXT,
		});

		const filterRules = [
			createFilterRule(prevState.model.columns[0].id),
			createFilterRule(prevState.model.columns[0].id),
		];
		prevState.model.filterRules = filterRules;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should handle text -> multi-tag when redo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
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
		expect(redoState.model.tags).toEqual(executeState.model.tags);
		expect(redoState.model.filterRules).toEqual(
			executeState.model.filterRules
		);
	});

	it("should delete filter rules when redo() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1, {
			cellType: CellType.TEXT,
		});

		const filterRules = [
			createFilterRule(prevState.model.columns[0].id),
			createFilterRule(prevState.model.columns[0].id),
		];
		prevState.model.filterRules = filterRules;

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.filterRules).toEqual(
			executeState.model.filterRules
		);
	});
});
