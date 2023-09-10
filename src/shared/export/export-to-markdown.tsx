import { LoomState } from "../loom-state/types";
import { markdownTable } from "markdown-table";
import { loomStateToArray } from "./loom-state-to-array";
import { App } from "obsidian";
import { escapePipeCharacters } from "./export-utils";

export const exportToMarkdown = (
	app: App,
	loomState: LoomState,
	shouldRemoveMarkdown: boolean
): string => {
	const arr = loomStateToArray(app, loomState, shouldRemoveMarkdown);
	//Markdown table cells can't contain pipe characters, so we escape them
	//Obsidian will render the escaped pipe characters as normal pipe characters
	const escapedArr = arr.map((row) =>
		row.map((cell) => escapePipeCharacters(cell))
	);
	return markdownTable(escapedArr);
};
