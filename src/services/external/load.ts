import NltPlugin from "main";
import { updateAppDataFromSavedState } from "./merge";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "src/constants";
import { SortDir } from "../sort/types";
import { AppData } from "../table/types";
import {
	findAppData,
	findCurrentViewType,
	parseTableFromEl,
	parseTableFromMarkdown,
} from "./loadUtils";
import { MarkdownSectionInformation } from "obsidian";

const findTableMarkdown = (sectionInfo: MarkdownSectionInformation) => {
	const { text, lineStart, lineEnd } = sectionInfo;
	const lines = text.split("\n");
	return lines
		.filter((_line, i) => i >= lineStart && i <= lineEnd)
		.join("\n");
};

const getTableDimensions = (table: string[][]) => {
	return { height: table.length, width: table[0].length };
};
/**
 * Loads app data
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadAppData = async (
	plugin: NltPlugin,
	el: HTMLElement,
	blockId: string,
	sectionInfo: MarkdownSectionInformation,
	sourcePath: string
): Promise<AppData> => {
	if (DEBUG.LOAD_APP_DATA) {
		console.log("");
		console.log("loadAppData()");
		console.log("Parsing table from element");
	}
	const markdown = findTableMarkdown(sectionInfo);
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

	if (plugin.settings.state[sourcePath]) {
		//Migration before 4.3.0
		//We update from index to block id
		if (plugin.settings.state[sourcePath][0]) {
			console.log("Migrating from before 4.3.0");
			plugin.settings.state[sourcePath][blockId] = {
				...plugin.settings.state[sourcePath][0],
			};
			delete plugin.settings.state[sourcePath][0];
		}
	}

	//We will delete settings for tables older than 4.3.0

	const settings = plugin.settings.state[sourcePath]?.[blockId];
	if (settings) {
		const { data: oldData, tableCacheVersion } = settings;
		//Force reload. This is to update the appData with `textContent` which is now necessary for rendering
		if (tableCacheVersion >= 500) {
			if (DEBUG.LOAD_APP_DATA) {
				console.log("Loading data from cache.");
				console.log("oldData", oldData);
			}
			const newData = findAppData(contentTable, textContentTable);
			return updateAppDataFromSavedState(oldData, newData);
		}
	}

	if (DEBUG.LOAD_APP_DATA) console.log("Loading new data.");

	const data = findAppData(contentTable, textContentTable);

	//When a user adds a new table, this entry will initially be null, we need to set this
	//so a user can add rows/columns via hotkeys
	plugin.settings.state[sourcePath] = {};

	const saveState = {
		data,
		shouldUpdate: false,
		viewType: findCurrentViewType(el),
		tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};

	plugin.settings.state[sourcePath][blockId] = saveState;

	if (DEBUG.LOAD_APP_DATA) console.log("data", saveState);

	await plugin.saveSettings();
	return data;
};
