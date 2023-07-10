import { LoomState } from "../types";
import { markdownTable } from "markdown-table";
import { LoomStateToArray } from "./loom-state-to-array";

export const exportToMarkdown = (
	LoomState: LoomState,
	renderMarkdown: boolean
): string => {
	const arr = LoomStateToArray(LoomState, renderMarkdown);
	return markdownTable(arr);
};
