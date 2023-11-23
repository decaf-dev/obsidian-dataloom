import {
	createCheckboxFilter,
	createCreationTimeFilter,
	createDateFilter,
	createEmbedFilter,
	createFileFilter,
	createLastEditedTimeFilter,
	createMultiTagFilter,
	createNumberFilter,
	createSourceFileFilter,
	createTagFilter,
	createTextFilter,
} from "../loom-state-factory";
import { LoomState } from "../types";
import { CellType, Column, Filter } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class FilterAddCommand extends LoomStateCommand {
	constructor() {
		super(false);
	}

	execute(prevState: LoomState): LoomState {
		const { filters, columns } = prevState.model;
		let column: Column = columns[0];

		if (column.type === CellType.SOURCE) {
			column = columns[1];
		}
		const { type, id } = column;

		let newFilter: Filter | null = null;
		if (type === CellType.TEXT) {
			newFilter = createTextFilter(id);
		} else if (type === CellType.FILE) {
			newFilter = createFileFilter(id);
		} else if (type === CellType.CHECKBOX) {
			newFilter = createCheckboxFilter(id);
		} else if (type === CellType.TAG) {
			newFilter = createTagFilter(id);
		} else if (type === CellType.MULTI_TAG) {
			newFilter = createMultiTagFilter(id);
		} else if (type === CellType.DATE) {
			newFilter = createDateFilter(id);
		} else if (type === CellType.NUMBER) {
			newFilter = createNumberFilter(id);
		} else if (type === CellType.EMBED) {
			newFilter = createEmbedFilter(id);
		} else if (type === CellType.CREATION_TIME) {
			newFilter = createCreationTimeFilter(id);
		} else if (type === CellType.LAST_EDITED_TIME) {
			newFilter = createLastEditedTimeFilter(id);
		} else if (type === CellType.SOURCE_FILE) {
			newFilter = createSourceFileFilter(id);
		} else {
			throw new Error("Unhandled cell type");
		}

		const nextFilters = [...filters, newFilter];

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				filters: nextFilters,
			},
		};
		this.onExecute(prevState, nextState);
		return nextState;
	}
}
