import MigrateState from "./migrate-state";
import { LoomState, Source, SourceType } from "../types/loom-state";
import { LoomState15 } from "../types";

/**
 * Migrates to 8.11.0
 */
export default class MigrateState15 implements MigrateState {
	public migrate(prevState: LoomState15): LoomState {
		const { sources } = prevState.model;

		const nextSources: Source[] = sources.map((source) => {
			if (source.type === SourceType.FOLDER) {
				const { id, path, type } = source;
				return {
					id,
					path,
					type,
					//Set default value
					includeSubfolders: true,
				};
			}
			return source;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
			},
		};
	}
}
