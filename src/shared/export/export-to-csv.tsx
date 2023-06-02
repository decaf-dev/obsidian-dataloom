import Papa from "papaparse";

import { tableStateToArray } from "./table-state-to-array";
import { TableState } from "../types/types";

export const exportToCSV = (tableState: TableState): string => {
	const arr = tableStateToArray(tableState, true);
	return Papa.unparse(arr);
};
