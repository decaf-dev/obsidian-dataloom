import MigrateState from "./migrate-state";
import { LoomState1 } from "../types/loom-state-1";
import { LoomState2, DateFormat as DateFormat2 } from "../types/loom-state-2";

/**
 * Migrates to 6.2.0
 */
export default class MigrateState1 implements MigrateState {
	public migrate(prevState: LoomState1): LoomState2 {
		const { columns } = prevState.model;

		const nextColumns = columns.map((column) => {
			return {
				...column,
				dateFormat: DateFormat2.DD_MM_YYYY,
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
