import {
	createCheckboxFilter,
	createFileFilter,
	createMultiTagFilter,
	createTagFilter,
	createTextFilter,
} from "../loom-state-factory";
import { LoomState } from "../types";
import { CellType, Filter } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class FilterAddCommand extends LoomStateCommand {
	columnId: string;
	cellType: CellType;
	addedFilter: Filter;

	constructor(columnId: string, cellType: CellType) {
		super();
		this.columnId = columnId;
		this.cellType = cellType;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { filters, columns } = prevState.model;
		const { id: columnId } = columns[0];

		let newFilter: Filter | null = null;
		if (this.cellType === CellType.TEXT) {
			newFilter = createTextFilter(columnId);
		} else if (this.cellType === CellType.FILE) {
			newFilter = createFileFilter(columnId);
		} else if (this.cellType === CellType.CHECKBOX) {
			newFilter = createCheckboxFilter(columnId);
		} else if (this.cellType === CellType.TAG) {
			newFilter = createTagFilter(columnId);
		} else if (this.cellType === CellType.MULTI_TAG) {
			newFilter = createMultiTagFilter(columnId);
		} else {
			throw new Error("Unhandled cell type");
		}

		this.addedFilter = newFilter;
		const nextFilters = [...filters, newFilter];

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

		const nextFilters = prevState.model.filters.filter(
			(f) => f.id !== this.addedFilter.id
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

		const { filters } = prevState.model;
		const nextFilters = [...filters, this.addedFilter];

		return {
			...prevState,
			model: {
				...prevState.model,
				filters: nextFilters,
			},
		};
	}
}
