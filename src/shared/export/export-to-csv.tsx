import { Buffer } from "buffer";
window.Buffer = Buffer;

import { stringify } from "csv-stringify/sync";
import { tableStateToArray } from "./table-state-to-array";
import { TableState } from "../types/types";

export const exportToCSV = (tableState: TableState): string => {
	const arr = tableStateToArray(tableState, true);
	return stringify(arr);
};
