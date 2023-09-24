import LoomStateCommand from "./loom-state-command";
import { LoomState, TableSettings } from "../types/loom-state";

export default class TableSettingsUpdateCommand<
	K extends keyof TableSettings
> extends LoomStateCommand {
	private key: K;
	private value: TableSettings[K];

	private previousValue: unknown;

	constructor(key: K, value: TableSettings[K]) {
		super();
		this.key = key;
		this.value = value;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { settings } = prevState.model;
		this.previousValue = settings[this.key];

		return {
			...prevState,
			model: {
				...prevState.model,
				settings: {
					...settings,
					[this.key]: this.value,
				},
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { settings } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				settings: {
					...settings,
					[this.key]: this.previousValue,
				},
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}
}
