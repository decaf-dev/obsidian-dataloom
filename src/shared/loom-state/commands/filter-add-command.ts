import {
	createCheckboxFilter,
	createCreationTimeFilter,
	createDateFilter,
	createEmbedFilter,
	createFileFilter,
	createLastEditedTimeFilter,
	createMultiTagFilter,
	createNumberFilter,
	createTagFilter,
	createTextFilter,
} from "../loom-state-factory";
import { LoomState } from "../types";
import { CellType, Filter } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class FilterAddCommand extends LoomStateCommand {
	private addedFilter: Filter;

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { filters, columns } = prevState.model;
		const { id: columnId, type } = columns[0];

		let newFilter: Filter | null = null;
		if (type === CellType.TEXT) {
			newFilter = createTextFilter(columnId);
		} else if (type === CellType.FILE) {
			newFilter = createFileFilter(columnId);
		} else if (type === CellType.CHECKBOX) {
			newFilter = createCheckboxFilter(columnId);
		} else if (type === CellType.TAG) {
			newFilter = createTagFilter(columnId);
		} else if (type === CellType.MULTI_TAG) {
			newFilter = createMultiTagFilter(columnId);
		} else if (type === CellType.DATE) {
			newFilter = createDateFilter(columnId);
		} else if (type === CellType.NUMBER) {
			newFilter = createNumberFilter(columnId);
		} else if (type === CellType.EMBED) {
			newFilter = createEmbedFilter(columnId);
		} else if (type === CellType.CREATION_TIME) {
			newFilter = createCreationTimeFilter(columnId);
		} else if (type === CellType.LAST_EDITED_TIME) {
			newFilter = createLastEditedTimeFilter(columnId);
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
