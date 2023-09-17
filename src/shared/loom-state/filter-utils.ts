import { CellType, Filter, LoomState } from "src/shared/loom-state/types";
import {
	createCheckboxFilter,
	createMultiTagFilter,
	createTagFilter,
	createTextFilter,
} from "./loom-state-factory";

export const addFilter = (
	prevState: LoomState,
	columnId: string,
	cellType: CellType
): LoomState => {
	const { model } = prevState;
	let filter: Filter | null = null;
	if (cellType === CellType.TEXT || cellType === CellType.FILE) {
		filter = createTextFilter(columnId);
	} else if (cellType === CellType.CHECKBOX) {
		filter = createCheckboxFilter(columnId);
	} else if (cellType === CellType.TAG) {
		filter = createTagFilter(columnId);
	} else if (cellType === CellType.MULTI_TAG) {
		filter = createMultiTagFilter(columnId);
	} else {
		throw new Error("Unhandled cell type");
	}
	return {
		...prevState,
		model: {
			...model,
			filters: [...model.filters, filter],
		},
	};
};

export const deleteFilter = (prevState: LoomState, id: string): LoomState => {
	const { model } = prevState;
	const { filters } = model;

	return {
		...prevState,
		model: {
			...model,
			filters: filters.filter((filter) => filter.id !== id),
		},
	};
};
