import { TableState } from "../types";
import { markdownTable } from "markdown-table";
import { tableStateToArray } from "./table-state-to-array";

export const exportToMarkdown = (
	tableState: TableState,
	renderMarkdown: boolean
): string => {
	const arr = tableStateToArray(tableState, renderMarkdown);
	return markdownTable(arr);
};
