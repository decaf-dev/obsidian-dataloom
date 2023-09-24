import LoomStateCommand from "./loom-state-command";
import { Filter, LoomState } from "../types/loom-state";

export default class FilterUpdateCommand<
	T extends Filter
> extends LoomStateCommand {
	private id: string;
	private data: Partial<T>;
	private isPartial: boolean;

	private prevFilter: Filter;
	private nextFilter: Filter;

	constructor(id: string, data: Partial<T>, isPartial = true) {
		super();
		this.id = id;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { filters } = prevState.model;
		const nextFilters = filters.map((filter) => {
			if (filter.id === this.id) {
				this.prevFilter = structuredClone(filter);

				let newFilter: T = this.data as T;
				if (this.isPartial)
					newFilter = { ...filter, ...this.data } as T;
				this.nextFilter = newFilter;
				return newFilter;
			}
			return filter;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				filters: nextFilters,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { filters } = prevState.model;
		const nextFilters = filters.map((filter) => {
			if (filter.id === this.nextFilter.id) {
				return this.prevFilter;
			}
			return filter;
		});
		return {
			...prevState,
			model: {
				...prevState.model,
				filters: nextFilters,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { filters } = prevState.model;
		const nextFilters = filters.map((filter) => {
			if (filter.id === this.id) {
				return this.nextFilter;
			}
			return filter;
		});
		return {
			...prevState,
			model: {
				...prevState.model,
				filters: nextFilters,
			},
		};
	}
}
