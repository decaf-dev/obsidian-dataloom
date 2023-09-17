import MigrateState from "./migrate-state";
import { LoomState2, Column as Column2 } from "../types/loom-state-2";
import { LoomState3 } from "../types/loom-state-3";

/**
 * Migrates to 6.3.0
 */
export default class MigrateState2 implements MigrateState {
	public migrate(prevState: LoomState2): LoomState3 {
		const { columns, rows, cells } = prevState.model;

		//Feat: Drag and drag rows
		const nextRows = rows.map((row, i) => {
			return {
				...row,
				index: i,
			};
		});

		//Feat: Column toggle
		const nextColumns = columns.map((column) => {
			const columnCopy: unknown = structuredClone(column);
			const unknownColumn = columnCopy as Record<string, unknown>;

			//Remove old property
			if (unknownColumn["hasAutoWidth"]) {
				delete unknownColumn.hasAutoWidth;
			}
			return {
				...(columnCopy as Column2),
				isVisible: true,
			};
		});

		//Feat: Date formats for Date type
		const nextCells = cells.map((cell) => {
			return {
				...cell,
				dateTime: null,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				cells: nextCells,
				rows: nextRows,
			},
		};
	}
}
