import { TableState } from "../types/types";
import { markdownTable } from "markdown-table";
import { tableStateToArray } from "./table-state-to-array";

export const exportToMarkdown = (tableState: TableState): string => {
	const arr = tableStateToArray(tableState, false);
	return markdownTable(arr);
};
