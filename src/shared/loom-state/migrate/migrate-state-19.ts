import MigrateState from "./migrate-state";
import { LoomState } from "../types";
import {
	LoomState18,
	SourceType as SourceType18,
} from "../types/loom-state-18";
import { ObsidianFolderSource } from "../types/loom-state";

/**
 * Migrates to 8.15.0
 */
export default class MigrateState19 implements MigrateState {
	public migrate(prevState: LoomState18): LoomState {
		const { sources } = prevState.model;

		const nextSources = sources.filter(
			(source) => source.type !== SourceType18.TAG
		) as unknown as ObsidianFolderSource[];

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
			},
		};
	}
}
