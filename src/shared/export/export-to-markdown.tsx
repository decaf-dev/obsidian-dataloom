import { markdownTable } from "markdown-table";
import { App } from "obsidian";
import type { LoomState } from "../loom-state/types/loom-state";
import {
	escapePipeCharacters,
	replaceNewLinesWithBreaks,
} from "./export-utils";
import { loomStateToArray } from "./loom-state-to-array";

export const exportToMarkdown = (
	app: App,
	loomState: LoomState,
	shouldRemoveMarkdown: boolean
): string => {
	let arr = loomStateToArray(app, loomState, shouldRemoveMarkdown);

	//Markdown table cells can't contain new lines, so we replace them with <br> tags
	arr = arr.map((row) => row.map((cell) => replaceNewLinesWithBreaks(cell)));

	//Markdown table cells can't contain pipe characters, so we escape them
	//Obsidian will render the escaped pipe characters as normal pipe characters
	arr = arr.map((row) => row.map((cell) => escapePipeCharacters(cell)));
	return markdownTable(arr);
};
