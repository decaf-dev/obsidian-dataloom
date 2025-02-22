import { getFilterConditionsForPropertyType } from "src/react/loom-app/option-bar/sources-menu/add-source-submenu/utils";
import { type LoomState20 } from "../types";
import { type LoomState19, SourceType } from "../types/loom-state-19";
import MigrateState from "./migrate-state";

/**
 * Migrates to 8.15.1
 */
export default class MigrateState20 implements MigrateState {
	public migrate(prevState: LoomState19): LoomState20 {
		const { sources } = prevState.model;

		const nextSources = sources.map((source) => {
			const { type } = source;
			if (type === SourceType.FRONTMATTER) {
				const { propertyType } = source;
				return {
					...source,
					filterCondition:
						getFilterConditionsForPropertyType(propertyType)[0],
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
