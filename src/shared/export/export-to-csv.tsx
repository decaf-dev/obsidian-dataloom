import Papa from "papaparse";

import { LoomStateToArray } from "./loom-state-to-array";
import { LoomState } from "../types";

export const exportToCSV = (
	LoomState: LoomState,
	renderMarkdown: boolean
): string => {
	const arr = LoomStateToArray(LoomState, renderMarkdown);
	return Papa.unparse(arr);
};
