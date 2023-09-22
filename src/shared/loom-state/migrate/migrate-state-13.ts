import MigrateState from "./migrate-state";
import { LoomState } from "../types/loom-state";
import { LoomState13 } from "../types/loom-state-13";

/**
 * Migrates to 8.6.0
 */
export default class MigrateState12 implements MigrateState {
	public migrate(prevState: LoomState13): LoomState {
		const {
			settings,
			columns,
			headerCells,
			headerRows,
			bodyCells,
			bodyRows,
			filters,
		} = prevState.model;

		const nextSettings = {
			...settings,
			showCalculationRow: true,
		};

		return {
			...prevState,
			model: {
				columns,
				headerCells,
				headerRows,
				bodyCells,
				bodyRows,
				filters,
				settings: nextSettings,
			},
		};
	}
}
