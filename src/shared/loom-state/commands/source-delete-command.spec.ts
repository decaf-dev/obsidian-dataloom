import {
	createTestLoomState,
	createSource,
	createColumn,
	createCustomTestLoomState,
	createRowWithCells,
} from "src/shared/loom-state/loom-state-factory";
import SourceDeleteCommand from "./source-delete-command";
import { CellType, SourceType } from "../types/loom-state";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";

describe("column-delete-command", () => {
	function stateWithOneSource() {
		const sources = [createSource(SourceType.FOLDER, "test")];
		const columns = [
			createColumn({ cellType: CellType.SOURCE }),
			createColumn({ cellType: CellType.SOURCE_FILE }),
			createColumn(),
		];
		const rows = [
			createRowWithCells(0, columns),
			createRowWithCells(1, columns, { sourceId: sources[0].id }),
			createRowWithCells(2, columns, { sourceId: sources[0].id }),
		];
		const state = createCustomTestLoomState(columns, rows, {
			sources,
		});
		return state;
	}

	function stateWithTwoSources() {
		const sources = [
			createSource(SourceType.FOLDER, "test"),
			createSource(SourceType.FOLDER, "test2"),
		];
		const columns = [
			createColumn({ cellType: CellType.SOURCE }),
			createColumn({ cellType: CellType.SOURCE_FILE }),
			createColumn(),
		];
		const rows = [
			createRowWithCells(0, columns),
			createRowWithCells(1, columns, { sourceId: sources[0].id }),
			createRowWithCells(2, columns, { sourceId: sources[0].id }),
		];
		const state = createCustomTestLoomState(columns, rows, {
			sources,
		});
		return state;
	}

	it("throws an error when undo() is called before execute()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new SourceDeleteCommand("");

		try {
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("throws an error when redo() is called before undo()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new SourceDeleteCommand("");

		try {
			const executeState = command.execute(prevState);
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("deletes a source and its corresponding rows when execute() is called", () => {
		//Arrange
		const prevState = stateWithTwoSources();

		//Act
		const command = new SourceDeleteCommand(prevState.model.sources[0].id);
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.sources).toHaveLength(1);
		expect(executeState.model.columns).toEqual(prevState.model.columns);
		expect(executeState.model.rows).toHaveLength(1);
	});

	it("deletes the source column and source file column when the last source is deleted", () => {
		//Arrange
		const prevState = stateWithOneSource();

		//Act
		const command = new SourceDeleteCommand(prevState.model.sources[0].id);
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.sources).toHaveLength(0);
		expect(executeState.model.columns).toHaveLength(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(executeState.model.rows).toHaveLength(1);
	});

	it("restores the deleted source and rows when undo() is called", () => {
		//Arrange
		const prevState = stateWithTwoSources();

		//Act
		const command = new SourceDeleteCommand(prevState.model.sources[0].id);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.sources).toEqual(prevState.model.sources);
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("restores the deleted sources, rows, and columns when undo is called()", () => {
		//Arrange
		const prevState = stateWithOneSource();

		//Act
		const command = new SourceDeleteCommand(prevState.model.sources[0].id);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.sources).toEqual(prevState.model.sources);
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("deletes the source and rows when redo() is called", () => {
		//Arrange
		const prevState = stateWithTwoSources();

		//Act
		const command = new SourceDeleteCommand(prevState.model.sources[0].id);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.sources).toEqual(executeState.model.sources);
		expect(redoState.model.columns).toEqual(executeState.model.columns);
		expect(redoState.model.rows).toEqual(executeState.model.rows);
	});

	it("deletes the source, rows, and columns when redo() is called", () => {
		//Arrange
		const prevState = stateWithOneSource();

		//Act
		const command = new SourceDeleteCommand(prevState.model.sources[0].id);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.sources).toEqual(executeState.model.sources);
		expect(redoState.model.columns).toEqual(executeState.model.columns);
		expect(redoState.model.rows).toEqual(executeState.model.rows);
	});
});
