import { TableState } from "../types";
import { markdownTable } from "markdown-table";
import { dashboardStateToArray } from "./table-state-to-array";

export const exportToMarkdown = (
	dashboardState: TableState,
	renderMarkdown: boolean
): string => {
	const arr = dashboardStateToArray(dashboardState, renderMarkdown);
	return markdownTable(arr);
};
