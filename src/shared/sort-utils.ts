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
