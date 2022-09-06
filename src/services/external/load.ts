import NltPlugin from "src/main";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "../../constants";
import { DEFAULT_COLUMN_SETTINGS, TableState } from "../table/types";
import {
	findTableModel,
	findCurrentViewType,
	parseTableFromEl,
	parseTableFromMarkdown,
} from "./loadUtils";
import { MarkdownSectionInformation } from "obsidian";

export const sectionInfoToMarkdown = (
	sectionInfo: MarkdownSectionInformation
) => {
	const { text, lineStart, lineEnd } = sectionInfo;
	const lines = text.split("\n");
	return lines
		.filter((_line, i) => i >= lineStart && i <= lineEnd)
		.join("\n");
};

const getTableDimensions = (table: string[][]) => {
	return { height: table.length, width: table[0].length };
};

export const loadTableState = async (
	plugin: NltPlugin,
	el: HTMLElement,
	blockId: string,
	sectionInfo: MarkdownSectionInformation,
	sourcePath: string
): Promise<TableState> => {
	if (DEBUG.LOAD_APP_DATA) {
		console.log("");
		console.log("loadTableState()");
		console.log("Parsing table from element");
	}
	const markdown = sectionInfoToMarkdown(sectionInfo);
	const contentTable = parseTableFromMarkdown(markdown); //Get dimensions
	const textContentTable = parseTableFromEl(el); //Get dimensions

	const contentTableDim = getTableDimensions(contentTable);
	const textContentTableDim = getTableDimensions(textContentTable);
	if (
		contentTableDim.height !== textContentTableDim.height ||
		contentTableDim.width !== contentTableDim.width
	) {
		throw new Error(
			"Content table and text content table dimensions don't match. Please fix algorithm."
		);
	}

	if (DEBUG.LOAD_APP_DATA) {
		console.log("content", contentTable);
		console.log("textContent", textContentTable);
	}

	if (DEBUG.LOAD_APP_DATA) console.log("Loading new data.");

	const model = findTableModel(contentTable, textContentTable);

	let tableState: TableState | null = null;
	const savedState = plugin.settings.data[sourcePath]?.[blockId];
	if (savedState) {
		const { tableCacheVersion } = savedState;
		if (DEBUG.LOAD_APP_DATA) {
			console.log("Loading table state from cache.");
		}
		tableState = { ...savedState };

		if (tableCacheVersion < CURRENT_TABLE_CACHE_VERSION)
			tableState.tableCacheVersion = CURRENT_TABLE_CACHE_VERSION;
	} else {
		const columnSettings = Object.fromEntries(
			model.headers.map((_header, i) => {
				return [i, DEFAULT_COLUMN_SETTINGS];
			})
		);
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
	plugin.settings.data[sourcePath][blockId] = tableState;
	await plugin.saveSettings();
	return tableState;
};
