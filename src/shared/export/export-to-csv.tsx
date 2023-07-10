import Papa from "papaparse";

import { tableStateToArray } from "./table-state-to-array";
import { TableState } from "../types";

export const exportToCSV = (
	tableState: TableState,
	renderMarkdown: boolean
): string => {
	const arr = tableStateToArray(tableState, renderMarkdown);
	return Papa.unparse(arr);
};
