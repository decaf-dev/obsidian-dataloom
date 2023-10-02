import MigrateState from "./migrate-state";
import { Column, LoomState, Row } from "../types/loom-state";
import { LoomState14 } from "../types/loom-state-14";

/**
 * Migrates to 8.7.0
 */
export default class MigrateState14 implements MigrateState {
	public migrate(prevState: LoomState14): LoomState {
		const { rows, columns } = prevState.model;
		const nextRows: Row[] = rows.map((row) => {
			return {
				...row,
				sourceId: null,
			};
		});

		const newColumns: Column[] = columns.map((column) => {
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
			},
		};
	}
}
