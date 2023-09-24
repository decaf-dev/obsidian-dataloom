import { LoomState } from "../types";
import { Filter } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class FilterDeleteCommand extends LoomStateCommand {
	private deletedFilter: {
		arrIndex: number;
		filter: Filter;
	};
	private id: string;

	constructor(id: string) {
		super();
		this.id = id;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { filters } = prevState.model;
		const nextFilters: Filter[] = filters.filter((f) => {
			if (f.id === this.id) {
				this.deletedFilter = {
					arrIndex: filters.indexOf(f),
					filter: structuredClone(f),
				};
				return false;
			}
			return true;
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
		const nextFilters: Filter[] = structuredClone(filters);
		nextFilters.splice(
			this.deletedFilter.arrIndex,
			0,
			this.deletedFilter.filter
		);
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
		return this.execute(prevState);
	}
}
