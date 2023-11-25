import {
	createFolderSource,
	createColumn,
	createLoomState,
	createTextCell,
	createRow,
	createSourceCell,
	createSourceFileCell,
	createGenericLoomState,
} from "src/shared/loom-state/loom-state-factory";
import { CellType } from "../types/loom-state";
import SourceAddCommand from "./source-add-command";

describe("source-add-command", () => {
	function stateWithOneSource() {
		const sources = [createFolderSource("test1", false)];
		const columns = [
			createColumn({ type: CellType.SOURCE }),
			createColumn({ type: CellType.SOURCE_FILE }),
			createColumn(),
		];
		const rows = [
			createRow(0, {
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id),
					createTextCell(columns[2].id),
				],
			}),
			createRow(1, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id, {
						path: "test1/file1.md",
					}),
					createTextCell(columns[2].id),
				],
			}),
			createRow(2, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id, {
						path: "test1/file2.md",
					}),
					createTextCell(columns[2].id),
				],
			}),
		];
		const state = createGenericLoomState({ columns, rows, sources });
		return state;
	}

	function stateWithZeroSources() {
		const state = createLoomState(1, 1);
		return state;
	}

	it("adds a source when execute() is called", () => {
		//Arrange
		const prevState = stateWithOneSource();

		//Act
		const command = new SourceAddCommand(
			createFolderSource("test2", false)
		);
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.sources).toHaveLength(2);
		expect(executeState.model.columns).toEqual(prevState.model.columns);
		expect(executeState.model.rows[0].sourceId).toEqual(null);
		expect(executeState.model.rows[1].sourceId).toEqual(
			executeState.model.sources[0].id
		);
		expect(executeState.model.rows[2].sourceId).toEqual(
			executeState.model.sources[0].id
		);
	});

	it("adds a source, a source column, and a source file column when execute() is called", () => {
		//Arrange
		const prevState = stateWithZeroSources();

		//Act
		const command = new SourceAddCommand(
			createFolderSource("test1", false)
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
		expect(executeState.model.rows).toHaveLength(1);
		expect(executeState.model.rows[0].sourceId).toEqual(null);
	});
});
