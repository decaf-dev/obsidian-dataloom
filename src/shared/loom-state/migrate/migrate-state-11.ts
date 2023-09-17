import MigrateState from "./migrate-state";
import { LoomState11 } from "../types/loom-state-11";
import { LoomState12 } from "../types/loom-state-12";

/**
 * Migrates to 8.2.0
 */
export default class MigrateState11 implements MigrateState {
	public migrate(prevState: LoomState11): LoomState12 {
		return {
			...prevState,
			model: {
				...prevState.model,
				settings: {
					numFrozenColumns: 1,
				},
			},
		};
	}
}
