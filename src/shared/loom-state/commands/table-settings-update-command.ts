import LoomStateCommand from "./loom-state-command";
import { LoomState, TableSettings } from "../types/loom-state";

export default class TableSettingsUpdateCommand<
	K extends keyof TableSettings
> extends LoomStateCommand {
	private key: K;
	private value: TableSettings[K];

	constructor(key: K, value: TableSettings[K]) {
		super(false);
		this.key = key;
		this.value = value;
	}

	execute(prevState: LoomState): LoomState {
		const { settings } = prevState.model;

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				settings: {
					...settings,
					[this.key]: this.value,
				},
			},
		};
		this.onExecute(prevState, nextState);
		return nextState;
	}
}
