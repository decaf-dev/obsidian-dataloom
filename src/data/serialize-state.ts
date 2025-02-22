import {
	isVersionLessThan,
	legacyVersionToString,
} from "src/shared/versioning";

import type { LoomState } from "src/shared/loom-state/types";

import { LoomStateObject } from "src/shared/loom-state/validate-state";
import DeserializationError from "./deserialization-error";

export const serializeState = (state: LoomState): string => {
	//Filter out any source rows, as these are populated by the plugin
	const filteredRows = state.model.rows.filter(
		(row) => row.sourceId === null
	);
	const filteredState = {
		...state,
		model: {
			...state.model,
			rows: filteredRows,
		},
	};
	return JSON.stringify(filteredState, null, 2);
};

export const deserializeState = (
	data: string,
	pluginVersion: string
): LoomState => {
	let fileVersion = "Unknown";
	let failedMigration: string | null = null;

	try {
		const parsedState = JSON.parse(data);
		const untypedVersion: unknown = parsedState["pluginVersion"];

		if (typeof untypedVersion === "number") {
			//This is needed for 6.10.0 and less
			fileVersion = legacyVersionToString(untypedVersion);
		} else if (typeof untypedVersion === "string") {
			fileVersion = untypedVersion;
		}

		if (isVersionLessThan(pluginVersion, fileVersion)) {
			throw new Error(
				"Loom was made with a newer plugin version. Please update the DataLoom plugin of this vault."
			);
		}

		let currentState: unknown = parsedState;

		// const VERSION_6_1_0 = "6.1.0";
		// if (isVersionLessThan(fileVersion, VERSION_6_1_0)) {
		// 	failedMigration = VERSION_6_1_0;
		// 	const nextState = new MigrateState0().migrate(
		// 		currentState as LoomState0
		// 	);
		// 	currentState = nextState;
		// 	failedMigration = null;
		// }

		//TODO handle previous versions?
		LoomStateObject.check(currentState);

		const state = currentState as LoomState;
		state.pluginVersion = pluginVersion;
		return state;
	} catch (err: unknown) {
		throw new DeserializationError(
			err,
			pluginVersion,
			fileVersion,
			failedMigration
		);
	}
};
