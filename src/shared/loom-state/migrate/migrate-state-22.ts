import type { LoomState } from "../types";
import { SortDir, type Column } from "../types/loom-state";
import type { LoomState21 } from "../types/loom-state-21";
import MigrateState from "./migrate-state";

/**
 * Migrates to 8.16.0
 */
export default class MigrateState22 implements MigrateState {
	public migrate(prevState: LoomState21): LoomState {
		const { columns } = prevState.model;

		const nextColumns: Column[] = columns.map((column) => {
			return {
				...column,
				multiTagSortDir: SortDir.NONE,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
	}
}
