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

export const serializeLoomState = (state: LoomState): string => {
	return JSON.stringify(state, null, 2);
};

export const deserializeLoomState = (
	data: string,
	pluginVersion: string
): LoomState => {
	const parsedState = JSON.parse(data);
	const untypedVersion: unknown = parsedState["pluginVersion"];

	let fileVersion = "";
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

	if (isVersionLessThan(fileVersion, "6.1.0")) {
		const nextState = new MigrateState0().migrate(
			currentState as LoomState0
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.2.0")) {
		const nextState = new MigrateState1().migrate(
			currentState as LoomState1
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.3.0")) {
		const nextState = new MigrateState2().migrate(
			currentState as LoomState2
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.4.0")) {
		const nextState = new MigrateState3().migrate(
			currentState as LoomState3
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.8.0")) {
		const nextState = new MigrateState4().migrate(
			currentState as LoomState4
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.9.1")) {
		const nextState = new MigrateState5().migrate(
			currentState as LoomState5
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.10.0")) {
		const nextState = new MigrateState6().migrate(
			currentState as LoomState6
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.12.3")) {
		const nextState = new MigrateState7().migrate(
			currentState as LoomState7
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.17.0")) {
		const nextState = new MigrateState8().migrate(
			currentState as LoomState8
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.18.6")) {
		const nextState = new MigrateState9().migrate(
			currentState as LoomState9
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "6.19.0")) {
		const nextState = new MigrateState10().migrate(
			currentState as LoomState10
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "8.2.0")) {
		const nextState = new MigrateState11().migrate(
			currentState as LoomState11
		);
		currentState = nextState;
	}

	if (isVersionLessThan(fileVersion, "8.5.0")) {
		const nextState = new MigrateState12().migrate(
			currentState as LoomState12
		);
		currentState = nextState;
	}

	const state = currentState as LoomState;
	state.pluginVersion = pluginVersion;
	return state;
};
