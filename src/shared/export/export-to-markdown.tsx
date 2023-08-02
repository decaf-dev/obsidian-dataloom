import { LoomState } from "../loom-state/types";
import { markdownTable } from "markdown-table";
import { loomStateToArray } from "./loom-state-to-array";
import { App } from "obsidian";

export const exportToMarkdown = (
	app: App,
	loomState: LoomState,
	renderMarkdown: boolean
): string => {
	const arr = loomStateToArray(app, loomState, renderMarkdown);
	return markdownTable(arr);
};
