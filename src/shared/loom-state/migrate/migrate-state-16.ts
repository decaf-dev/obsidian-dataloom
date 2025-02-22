import type { LoomState15, LoomState16 } from "../types";
import { SourceType } from "../types/loom-state-15";
import { type Source } from "../types/loom-state-16";
import MigrateState from "./migrate-state";

/**
 * Migrates to 8.11.0
 */
export default class MigrateState16 implements MigrateState {
	public migrate(prevState: LoomState15): LoomState16 {
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
