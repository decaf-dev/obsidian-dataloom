import {
	createFolderSource,
	createColumn,
	createGenericLoomState,
	createRow,
	createSourceCell,
	createSourceFileCell,
	createTextCell,
} from "src/shared/loom-state/loom-state-factory";
import SourceDeleteCommand from "./source-delete-command";
import { CellType } from "../types/loom-state";

describe("source-delete-command", () => {
	function stateWithOneSource() {
		const sources = [createFolderSource("test", false)];
		const columns = [
			createColumn({ type: CellType.SOURCE }),
			createColumn({ type: CellType.SOURCE_FILE }),
			createColumn({ type: CellType.TEXT }),
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
					createSourceFileCell(columns[1].id),
					createTextCell(columns[2].id),
				],
			}),
			createRow(2, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id),
					createTextCell(columns[2].id),
				],
			}),
		];
		const state = createGenericLoomState({ columns, rows, sources });
		return state;
	}

	function stateWithTwoSources() {
		const sources = [
			createFolderSource("test", false),
			createFolderSource("test2", false),
		];
		const columns = [
			createColumn({ type: CellType.SOURCE }),
			createColumn({ type: CellType.SOURCE_FILE }),
			createColumn({ type: CellType.TEXT }),
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
					createSourceFileCell(columns[1].id),
					createTextCell(columns[2].id),
				],
			}),
			createRow(2, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id),
					createTextCell(columns[2].id),
				],
			}),
		];
		const state = createGenericLoomState({ columns, rows, sources });
		return state;
	}

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
});
