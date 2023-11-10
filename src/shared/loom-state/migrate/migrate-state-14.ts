import MigrateState from "./migrate-state";
import {
	Column as Column15,
	LoomState15,
	Row as Row15,
} from "../types/loom-state-15";
import { LoomState14 } from "../types/loom-state-14";

/**
 * Migrates to 8.7.0
 */
export default class MigrateState14 implements MigrateState {
	public migrate(prevState: LoomState14): LoomState15 {
		const { rows, columns } = prevState.model;
		const nextRows: Row15[] = rows.map((row) => {
			return {
				...row,
				sourceId: null,
			};
		});

		const newColumns: Column15[] = columns.map((column) => {
			return {
				...column,
				frontmatterKey: null,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
				columns: newColumns,
				sources: [],
				externalRowOrder: [],
			},
		};
	}
}
