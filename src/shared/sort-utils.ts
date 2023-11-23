import { LoomState, SortDir } from "./loom-state/types/loom-state";

/**
 * Confirm that the user wants to change the default sort order
 * @param state - The current loom state
 */
export const confirmSortOrderChange = (state: LoomState) => {
	const { columns } = state.model;
	const isSorted = columns.find((column) => column.sortDir !== SortDir.NONE);
	if (isSorted) {
		return window.confirm(
			"This will set the default row sorting as the current sort order. Do you wish to continue?" +
				"\n\n" +
				"If not, please remove the sort filter before preforming this operation."
		);
	}
	return true;
};

export const sortByBoolean = (
	a: boolean,
	b: boolean,
	sortDir: SortDir
): number => {
	if (sortDir === SortDir.ASC) {
		if (a && !b) return 1;
		if (!a && b) return -1;
		return 0;
	} else if (sortDir === SortDir.DESC) {
		if (b && !a) return 1;
		if (!b && a) return -1;
		return 0;
	} else {
		return 0;
	}
};

export const sortByNumber = (
	a: number,
	b: number,
	sortDir: SortDir
): number => {
	if (sortDir === SortDir.ASC) {
		return a - b;
	} else if (sortDir === SortDir.DESC) {
		return b - a;
	} else {
		return 0;
	}
};

export const sortByText = (
	a: string,
	b: string,
	sortDir: SortDir,
	forceEmptyToBottom = true
): number => {
	const result = forceEmptyTextCellsToBottom(a, b);
	if (result !== null) {
		if (forceEmptyToBottom) {
			return result;
		}
	}

	if (sortDir === SortDir.ASC) {
		return a.localeCompare(b);
	} else if (sortDir === SortDir.DESC) {
		return b.localeCompare(a);
	} else {
		return 0;
	}
};

export const forceEmptyNumberCellsToBottom = (
	a: number | null,
	b: number | null
): number | null => {
	//Force empty cells to the bottom
	if (a === null && b !== null) return 1;
	if (a !== null && b === null) return -1;
	if (a === null && b === null) return 0;
	return null;
};

export const forceEmptyTextCellsToBottom = (
	a: string,
	b: string
): number | null => {
	//Force empty cells to the bottom
	if (a === "" && b !== "") return 1;
	if (a !== "" && b === "") return -1;
	if (a === "" && b === "") return 0;
	return null;
};
