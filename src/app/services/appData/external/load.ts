import { NltSettings } from "../../settings";
import NltPlugin from "main";
import { parseTableFromEl } from "./loadUtils";
import { updateAppDataFromSavedState } from "./merge";
import {
	hasValidHeaderRow,
	hasValidTypeDefinitionRow,
	hasValidRowIds,
	hasValidColumnIds,
} from "../../string/validators";
import { DEBUG } from "src/app/constants";
import { findAppData } from "./saveUtils";
import { findTableId } from "./saveUtils";
import { LoadedData } from "../state/loadedData";
import { appDataIdsToMarkdown, appDataTypesToMarkdown } from "../debug";

/**
 * Loads app data
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	el: HTMLElement,
	sourcePath: string
): LoadedData | null => {
	const parsedTable = parseTableFromEl(el);
	// if (DEBUG) {
	// 	console.log("PARSING TABLE FROM ELEMENT");
	// 	console.log(parsedTable);
	// }

	const tableId = findTableId(parsedTable);
	let isValidTable = true;
	if (!tableId) {
		// if (DEBUG) console.log("Invalid table id");
		isValidTable = false;
	}

	if (!hasValidHeaderRow(parsedTable)) {
		// if (DEBUG) console.log("Invalid header row");
		isValidTable = false;
	}

	if (!hasValidTypeDefinitionRow(parsedTable)) {
		// if (DEBUG) console.log("Invalid type definition row");
		isValidTable = false;
	}

	if (!hasValidColumnIds(parsedTable)) {
		// if (DEBUG) console.log("Invalid column ids");
		isValidTable = false;
	}

	if (!hasValidRowIds(parsedTable)) {
		// if (DEBUG) console.log("Invalid row ids");
		isValidTable = false;
	}

	if (!isValidTable) {
		return { tableId: null, data: null };
	}

	// if (DEBUG) {
	// 	console.log("FOUND TABLE ID", tableId);
	// }

	if (settings.appData[sourcePath]) {
		if (settings.appData[sourcePath][tableId]) {
			//This is a compatibility fix for v2.3.6 and less
			if (settings.appData[sourcePath][tableId].headers) {
				if (DEBUG.LOAD_APP_DATA.LOG_MESSAGE)
					console.log("LOADING CACHED APP DATA");

				const data = findAppData(parsedTable);
				const updated = updateAppDataFromSavedState(
					settings.appData[sourcePath][tableId],
					data
				);
				plugin.saveSettings();
				if (DEBUG.LOAD_APP_DATA.IDS)
					console.log(appDataIdsToMarkdown(tableId, data));
				if (DEBUG.LOAD_APP_DATA.TYPES)
					console.log(appDataTypesToMarkdown(tableId, data));
				return { tableId, data: updated };
			}
		}
	}

	const data = findAppData(parsedTable);
	if (DEBUG.LOAD_APP_DATA.LOG_MESSAGE) console.log("LOADING NEW APP DATA");
	if (DEBUG.LOAD_APP_DATA.IDS)
		console.log(appDataIdsToMarkdown(tableId, data));
	if (DEBUG.LOAD_APP_DATA.TYPES)
		console.log(appDataTypesToMarkdown(tableId, data));
	return { tableId, data };
};
