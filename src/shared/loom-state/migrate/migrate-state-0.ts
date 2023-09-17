import MigrateState from "./migrate-state";
import { LoomState0 } from "../types/loom-state-0";
import {
	LoomState1,
	CurrencyType as CurrencyType1,
} from "../types/loom-state-1";

/**
 * Migrates to 6.1.0
 */
export default class MigrateState0 implements MigrateState {
	public migrate(prevState: LoomState0): LoomState1 {
		const { columns } = prevState.model;

		const nextColumns = columns.map((column) => {
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
