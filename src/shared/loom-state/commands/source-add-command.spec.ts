import {
	createTestLoomState,
	createSource,
	createColumn,
	createCustomTestLoomState,
	createRowWithCells,
} from "src/shared/loom-state/loom-state-factory";
import { CellType, SourceType } from "../types/loom-state";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import SourceAddCommand from "./source-add-command";
import { App } from "obsidian";

describe("source-add-command", () => {
	const mockApp = {
		vault: {
			getMarkdownFiles: () => {
				return [
					{ parent: { path: "test1" }, path: "test1/file1.md" },
					{ parent: { path: "test1" }, path: "test1/file2.md" },
					{ parent: { path: "test2" }, path: "test2/file1.md" },
					{ parent: { path: "test2" }, path: "test2/file2.md" },
				];
			},
			getAbstractFileByPath: (path: string) => {
				return {
					path,
				};
			},
		},
	} as unknown as App;

	function stateWithOneSource() {
		const sources = [createSource(SourceType.FOLDER, "test1")];
		const columns = [
			createColumn({ type: CellType.SOURCE }),
			createColumn({ type: CellType.SOURCE_FILE }),
			createColumn(),
		];
		const rows = [
			createRowWithCells(0, columns),
			createRowWithCells(1, columns, {
				sourceId: sources[0].id,
				defaultContent: {
					type: CellType.SOURCE_FILE,
					content: "test1/file1.md",
				},
			}),
			createRowWithCells(2, columns, {
				sourceId: sources[0].id,
				defaultContent: {
					type: CellType.SOURCE_FILE,
					content: "test1/file2.md",
				},
			}),
		];
		const state = createCustomTestLoomState(columns, rows, {
			sources,
		});
		return state;
	}

	function stateWithZeroSources() {
		const columns = [createColumn()];
		const rows = [createRowWithCells(0, columns)];
		const state = createCustomTestLoomState(columns, rows);
		return state;
	}

	it("throws an error when undo() is called before execute()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new SourceAddCommand(
			mockApp,
			SourceType.FOLDER,
			"test"
		);

		try {
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("throws an error when redo() is called before undo()", () => {
		const prevState = createTestLoomState(1, 1);
		const command = new SourceAddCommand(
			mockApp,
			SourceType.FOLDER,
			"test"
		);

		try {
			const executeState = command.execute(prevState);
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("adds a source and its corresponding rows when execute() is called", () => {
		//Arrange
		const prevState = stateWithOneSource();

		//Act
		const command = new SourceAddCommand(
			mockApp,
			SourceType.FOLDER,
			"test2"
		);
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.sources).toHaveLength(2);
		expect(executeState.model.columns).toEqual(prevState.model.columns);
		expect(executeState.model.rows).toHaveLength(5);
		expect(executeState.model.rows[0].sourceId).toEqual(null);
		expect(executeState.model.rows[1].sourceId).toEqual(
			executeState.model.sources[0].id
		);
		expect(executeState.model.rows[2].sourceId).toEqual(
			executeState.model.sources[0].id
		);
		expect(executeState.model.rows[3].sourceId).toEqual(
			executeState.model.sources[1].id
		);
		expect(executeState.model.rows[4].sourceId).toEqual(
			executeState.model.sources[1].id
		);
	});

	it("adds a source, its corresponding rows, a source column, and a source file column when execute() is called", () => {
		//Arrange
		const prevState = stateWithZeroSources();

		//Act
		const command = new SourceAddCommand(
			mockApp,
			SourceType.FOLDER,
			"test1"
		);
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.sources).toHaveLength(1);
		expect(executeState.model.columns).toHaveLength(3);
		expect(executeState.model.columns[0].type).toEqual(CellType.SOURCE);
		expect(executeState.model.columns[1].type).toEqual(
			CellType.SOURCE_FILE
		);
		expect(executeState.model.columns[2].type).toEqual(CellType.TEXT);
		expect(executeState.model.rows).toHaveLength(3);
		expect(executeState.model.rows[0].sourceId).toEqual(null);
		expect(executeState.model.rows[1].sourceId).toEqual(
			executeState.model.sources[0].id
		);
		expect(executeState.model.rows[2].sourceId).toEqual(
			executeState.model.sources[0].id
		);
	});

	it("removes the source and its corresponding rows when undo() is called", () => {
		//Arrange
		const prevState = stateWithOneSource();

		//Act
		const command = new SourceAddCommand(
			mockApp,
			SourceType.FOLDER,
			"test2"
		);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.sources).toEqual(prevState.model.sources);
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("removes the source, its corresponding rows, and the added columns when undo() is called", () => {
		//Arrange
		const prevState = stateWithZeroSources();

		//Act
		const command = new SourceAddCommand(
			mockApp,
			SourceType.FOLDER,
			"test1"
		);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.sources).toEqual(prevState.model.sources);
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("restores the source and its corresponding rows when redo() is called", () => {
		//Arrange
		const prevState = stateWithOneSource();

		//Act
		const command = new SourceAddCommand(
			mockApp,
			SourceType.FOLDER,
			"test2"
		);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.sources).toEqual(executeState.model.sources);
		expect(redoState.model.columns).toEqual(executeState.model.columns);
		expect(redoState.model.rows).toEqual(executeState.model.rows);
	});

	it("restores the source, its corresponding rows, and the added columns when redo() is called", () => {
		//Arrange
		const prevState = stateWithZeroSources();

		//Act
		const command = new SourceAddCommand(
			mockApp,
			SourceType.FOLDER,
			"test1"
		);
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.sources).toEqual(executeState.model.sources);
		expect(redoState.model.columns).toEqual(executeState.model.columns);
		expect(redoState.model.rows).toEqual(executeState.model.rows);
	});
});
