import { cloneDeep } from "lodash";
import { type Column as Column2, type LoomState2 } from "../types/loom-state-2";
import {
	type Cell as Cell3,
	type Column as Column3,
	type LoomState3,
	type Row as Row3,
} from "../types/loom-state-3";
import MigrateState from "./migrate-state";

/**
 * Migrates to 6.3.0
 */
export default class MigrateState2 implements MigrateState {
	public migrate(prevState: LoomState2): LoomState3 {
		const { columns, rows, cells } = prevState.model;

		//Feat: Drag and drag rows
		const nextRows: Row3[] = rows.map((row, i) => {
			return {
				...row,
				index: i,
			};
		});

		//Feat: Column toggle
		const nextColumns: Column3[] = columns.map((column) => {
			const columnCopy: unknown = cloneDeep(column);
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
		const nextCells: Cell3[] = cells.map((cell) => {
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
