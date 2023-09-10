import Papa from "papaparse";

import { loomStateToArray } from "./loom-state-to-array";
import { LoomState } from "../loom-state/types";
import { App } from "obsidian";

export const exportToCSV = (
	app: App,
	loomState: LoomState,
	shouldRemoveMarkdown: boolean
): string => {
	const arr = loomStateToArray(app, loomState, shouldRemoveMarkdown);
	return Papa.unparse(arr);
};
