import type { LoomState0 } from "../types/loom-state-0";
import {
	CurrencyType as CurrencyType1,
	type Column as Column1,
	type LoomState1,
} from "../types/loom-state-1";
import MigrateState from "./migrate-state";

/**
 * Migrates to 6.1.0
 */
export default class MigrateState0 implements MigrateState {
	public migrate(prevState: LoomState0): LoomState1 {
		const { columns } = prevState.model;

		const nextColumns: Column1[] = columns.map((column) => {
			return {
				...column,
				currencyType: CurrencyType1.UNITED_STATES,
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
