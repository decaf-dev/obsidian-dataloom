import Papa from "papaparse";

import { tableStateToArray } from "./table-state-to-array";
import { DashboardState } from "../types";

export const exportToCSV = (
	tableState: DashboardState,
	renderMarkdown: boolean
): string => {
	const arr = tableStateToArray(tableState, renderMarkdown);
	return Papa.unparse(arr);
};
