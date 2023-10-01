import {
	createTextFilter,
	createTestLoomState,
	createSource,
	createColumn,
	createRow,
	createCell,
} from "src/shared/loom-state/loom-state-factory";
import SourceDeleteCommand from "./source-delete-command";
import { CellType, SourceType } from "../types/loom-state";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";

describe("column-delete-command", () => {
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

	it("deletes a source and its corresponding rows", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		const source = createSource(SourceType.FOLDER, "test");
		prevState.model.sources = [source];

		const columns = [
			createColumn({ cellType: CellType.SOURCE }),
			createColumn({ cellType: CellType.SOURCE_FILE }),
		];
		prevState.model.columns = [...columns, ...prevState.model.columns];

		const cells = columns.map((column, i) => {
			const { id, type } = column;
			const cell = createCell(id, {
				cellType: type,
				content: `test-${i}`,
			});
			return cell;
		});
		const row = createRow(0, {
			sourceId: source.id,
			cells,
		});
		prevState.model.rows[0] = row;

		//Act
		const command = new SourceDeleteCommand(source.id);
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.sources).toHaveLength(0);
	});
});
