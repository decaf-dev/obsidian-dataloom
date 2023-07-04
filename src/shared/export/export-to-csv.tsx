import Papa from "papaparse";

import { dashboardStateToArray } from "./table-state-to-array";
import { DashboardState } from "../types";

export const exportToCSV = (
	dashboardState: DashboardState,
	renderMarkdown: boolean
): string => {
	const arr = dashboardStateToArray(dashboardState, renderMarkdown);
	return Papa.unparse(arr);
};
