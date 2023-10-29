import MigrateState from "./migrate-state";
import { LoomState } from "../types/loom-state";

/**
 * Migrates to 8.8.0
 */
export default class MigrateState15 implements MigrateState {
	public migrate(prevState: LoomState): LoomState {
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
