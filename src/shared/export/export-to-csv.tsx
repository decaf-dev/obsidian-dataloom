import Papa from "papaparse";

import { loomStateToArray } from "./loom-state-to-array";
import { LoomState } from "../types";
import { App } from "obsidian";

export const exportToCSV = (
	app: App,
	loomState: LoomState,
	renderMarkdown: boolean
): string => {
	const arr = loomStateToArray(app, loomState, renderMarkdown);
	return Papa.unparse(arr);
};
