import {
	isVersionLessThan,
	legacyVersionToString,
} from "src/shared/versioning";

import {
	LoomState,
	LoomState0,
	LoomState1,
	LoomState2,
	LoomState3,
	LoomState4,
	LoomState5,
	LoomState6,
	LoomState7,
	LoomState8,
	LoomState9,
	LoomState10,
	LoomState11,
	LoomState12,
} from "src/shared/loom-state/types";

import {
	MigrateState0,
	MigrateState1,
	MigrateState2,
	MigrateState3,
	MigrateState4,
	MigrateState5,
	MigrateState6,
	MigrateState7,
	MigrateState8,
	MigrateState9,
	MigrateState10,
	MigrateState11,
	MigrateState12,
} from "src/shared/loom-state/migrate";
import { LoomState13 } from "src/shared/loom-state/types/loom-state-13";
import MigrateState13 from "src/shared/loom-state/migrate/migrate-state-13";
import { LoomStateObject } from "src/shared/loom-state/validate/validate-state";
import DeserializationError from "./deserialization-error";

export const serializeState = (state: LoomState): string => {
	return JSON.stringify(state, null, 2);
};

export const deserializeState = (
	data: string,
	pluginVersion: string
): LoomState => {
	let fileVersion = "";
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

		const VERSION_6_1_0 = "6.1.0";
		if (isVersionLessThan(fileVersion, VERSION_6_1_0)) {
			failedMigration = VERSION_6_1_0;
			const nextState = new MigrateState0().migrate(
				currentState as LoomState0
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_2_0 = "6.2.0";
		if (isVersionLessThan(fileVersion, VERSION_6_2_0)) {
			failedMigration = VERSION_6_2_0;
			const nextState = new MigrateState1().migrate(
				currentState as LoomState1
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_3_0 = "6.3.0";
		if (isVersionLessThan(fileVersion, VERSION_6_3_0)) {
			failedMigration = VERSION_6_3_0;
			const nextState = new MigrateState2().migrate(
				currentState as LoomState2
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_4_0 = "6.4.0";
		if (isVersionLessThan(fileVersion, VERSION_6_4_0)) {
			failedMigration = VERSION_6_4_0;
			const nextState = new MigrateState3().migrate(
				currentState as LoomState3
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_8_0 = "6.8.0";
		if (isVersionLessThan(fileVersion, VERSION_6_8_0)) {
			failedMigration = VERSION_6_8_0;
			const nextState = new MigrateState4().migrate(
				currentState as LoomState4
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_9_1 = "6.9.1";
		if (isVersionLessThan(fileVersion, VERSION_6_9_1)) {
			failedMigration = VERSION_6_9_1;
			const nextState = new MigrateState5().migrate(
				currentState as LoomState5
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_10_0 = "6.10.0";
		if (isVersionLessThan(fileVersion, VERSION_6_10_0)) {
			failedMigration = VERSION_6_10_0;
			const nextState = new MigrateState6().migrate(
				currentState as LoomState6
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_12_3 = "6.12.3";
		if (isVersionLessThan(fileVersion, VERSION_6_12_3)) {
			failedMigration = VERSION_6_12_3;
			const nextState = new MigrateState7().migrate(
				currentState as LoomState7
			);
			currentState = nextState;
			failedMigration = VERSION_6_12_3;
		}

		const VERSION_6_17_0 = "6.17.0";
		if (isVersionLessThan(fileVersion, VERSION_6_17_0)) {
			failedMigration = VERSION_6_17_0;
			const nextState = new MigrateState8().migrate(
				currentState as LoomState8
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_18_6 = "6.18.6";
		if (isVersionLessThan(fileVersion, VERSION_6_18_6)) {
			failedMigration = VERSION_6_18_6;
			const nextState = new MigrateState9().migrate(
				currentState as LoomState9
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_6_19_0 = "6.19.0";
		if (isVersionLessThan(fileVersion, VERSION_6_19_0)) {
			failedMigration = VERSION_6_19_0;
			const nextState = new MigrateState10().migrate(
				currentState as LoomState10
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_8_2_0 = "8.2.0";
		if (isVersionLessThan(fileVersion, VERSION_8_2_0)) {
			failedMigration = VERSION_8_2_0;
			const nextState = new MigrateState11().migrate(
				currentState as LoomState11
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_8_5_0 = "8.5.0";
		if (isVersionLessThan(fileVersion, VERSION_8_5_0)) {
			failedMigration = VERSION_8_5_0;
			const nextState = new MigrateState12().migrate(
				currentState as LoomState12
			);
			currentState = nextState;
			failedMigration = null;
		}

		const VERSION_8_6_0 = "8.6.0";
		if (isVersionLessThan(fileVersion, VERSION_8_6_0)) {
			failedMigration = VERSION_8_6_0;
			const nextState = new MigrateState13().migrate(
				currentState as LoomState13
			);
			currentState = nextState;
			failedMigration = null;
		}

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
