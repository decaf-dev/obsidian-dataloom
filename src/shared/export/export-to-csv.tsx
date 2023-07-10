import Papa from "papaparse";

import { dashboardStateToArray } from "./table-state-to-array";
import { TableState } from "../types";

export const exportToCSV = (
	dashboardState: TableState,
	renderMarkdown: boolean
): string => {
	const arr = dashboardStateToArray(dashboardState, renderMarkdown);
	return Papa.unparse(arr);
};
