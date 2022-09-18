import NltPlugin from "src/main";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "../../constants";
import { DEFAULT_COLUMN_SETTINGS, TableState } from "../table/types";
import {
	findTableModel,
	findCurrentViewType,
	parseCellsFromEl,
	parseCellsFromMarkdown,
} from "./loadUtils";

import { MarkdownTable } from "./types";

export const loadTableState = async (
	plugin: NltPlugin,
	el: HTMLElement,
	tableId: string,
	markdownTable: MarkdownTable,
	sourcePath: string
): Promise<TableState> => {
	if (DEBUG.LOAD_APP_DATA) {
		console.log("");
		console.log("loadTableState()");
		console.log("Parsing table from element");
	}

	const numColumns = el.getElementsByTagName("th").length;
	const contentCells = parseCellsFromMarkdown(markdownTable, numColumns);
	const textContentCells = parseCellsFromEl(el, numColumns);
	if (contentCells.length !== textContentCells.length) {
		console.log("Content cells", contentCells);
		console.log("Text content cells", textContentCells);
		throw new Error(
			"Content table and text content table dimensions don't match. Please fix algorithm."
		);
	}

	if (DEBUG.LOAD_APP_DATA) {
		console.log("content", contentCells);
		console.log("textContent", textContentCells);
	}

	if (DEBUG.LOAD_APP_DATA) console.log("Loading new data.");

	const model = findTableModel(contentCells, textContentCells, numColumns);

	let tableState: TableState | null = null;
	const savedState = plugin.settings.data[sourcePath]?.[tableId];
	if (savedState) {
		const { tableCacheVersion } = savedState;
		if (DEBUG.LOAD_APP_DATA) {
			console.log("Loading table state from cache.");
		}
		tableState = { ...savedState };
		tableState.tableModel = model;

		if (tableCacheVersion < CURRENT_TABLE_CACHE_VERSION)
			tableState.tableCacheVersion = CURRENT_TABLE_CACHE_VERSION;
	} else {
		const entries = [];
		for (let i = 0; i < numColumns; i++)
			entries.push([i, DEFAULT_COLUMN_SETTINGS]);
		const columnSettings = Object.fromEntries(entries);
		tableState = {
			tableModel: model,
			tableSettings: {
				columns: columnSettings,
			},
			shouldUpdate: false,
			viewType: findCurrentViewType(el),
			tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
		};
		//When a user adds a new table, this entry will initially be null, we need to set this
		//so a user can add rows/columns via hotkeys
		plugin.settings.data[sourcePath] = {};
	}
	plugin.settings.data[sourcePath][tableId] = tableState;
	await plugin.saveSettings();
	return tableState;
};
