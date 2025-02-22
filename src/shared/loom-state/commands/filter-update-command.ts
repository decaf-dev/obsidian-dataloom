import type { Filter, LoomState } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class FilterUpdateCommand<
	T extends Filter
> extends LoomStateCommand {
	private id: string;
	private data: Partial<T>;
	private isPartial: boolean;

	constructor(id: string, data: Partial<T>, isPartial = true) {
		super(false);
		this.id = id;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		const { filters } = prevState.model;
		const nextFilters = filters.map((filter) => {
			if (filter.id === this.id) {
				let newFilter: T = this.data as T;
				if (this.isPartial)
					newFilter = { ...filter, ...this.data } as T;
				return newFilter;
			}
			return filter;
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				filters: nextFilters,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
