import MigrateState from "./migrate-state";
import { LoomState15 } from "../types";

/**
 * Migrates to 8.8.0
 */
export default class MigrateState15 implements MigrateState {
	public migrate(prevState: LoomState15): LoomState15 {
		const { rows, columns, sources, filters, settings, externalRowOrder } =
			prevState.model;
		//There was a bug where `bodyRows` was being saved instead of `rows`
		//This update removes that for all tables
		return {
			...prevState,
			model: {
				rows,
				columns,
				filters,
				settings,
				externalRowOrder,
				sources,
			},
		};
	}
}
