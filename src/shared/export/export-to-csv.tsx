import { stringify } from "csv-stringify/sync";
import { tableStateToArray } from "./table-state-to-array";
import { TableState } from "../types/types";

//Shim the buffer object because it's not available on mobile
//It is used by the csv-stringify package
global.Buffer = require("buffer").Buffer;

export const exportToCSV = (tableState: TableState): string => {
	const arr = tableStateToArray(tableState, true);
	return stringify(arr);
};
