import { LoomState } from "../types";
import { Filter } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class FilterDeleteCommand extends LoomStateCommand {
	private id: string;

	constructor(id: string) {
		super(false);
		this.id = id;
	}

	execute(prevState: LoomState): LoomState {
		const { filters } = prevState.model;
		const nextFilters: Filter[] = filters.filter((f) => f.id !== this.id);

		const newState = {
			...prevState,
			model: {
				...prevState.model,
				filters: nextFilters,
			},
		};
		this.onExecute(prevState, newState);
		return newState;
	}
}
