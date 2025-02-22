import Papa from "papaparse";

import { App } from "obsidian";
import { type LoomState } from "../loom-state/types/loom-state";
import { loomStateToArray } from "./loom-state-to-array";

export const exportToCSV = (
	app: App,
	loomState: LoomState,
	shouldRemoveMarkdown: boolean
): string => {
	const arr = loomStateToArray(app, loomState, shouldRemoveMarkdown);
	return Papa.unparse(arr);
};
