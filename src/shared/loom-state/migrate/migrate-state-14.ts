import MigrateState from "./migrate-state";
import { LoomState } from "../types/loom-state";
import { LoomState14 } from "../types/loom-state-14";

/**
 * Migrates to 8.7.0
 */
export default class MigrateState14 implements MigrateState {
	public migrate(prevState: LoomState14): LoomState {
		return {
			...prevState,
			model: {
				...prevState.model,
				sources: [],
			},
		};
	}
}
