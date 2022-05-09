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
	if (DEBUG) {
		console.log("PARSING TABLE FROM ELEMENT");
		console.log(parsedTable);
	}

	const tableId = findTableId(parsedTable);
	if (!tableId) {
		if (DEBUG) console.log("Invalid table id");
		return { tableId: null, data: null };
	}

	if (!hasValidHeaderRow(parsedTable)) {
		if (DEBUG) console.log("Invalid header row");
		return { tableId: null, data: null };
	}

	if (!hasValidTypeDefinitionRow(parsedTable)) {
		if (DEBUG) console.log("Invalid type definition row");
		return { tableId: null, data: null };
	}

	if (!hasValidColumnIds(parsedTable)) {
		if (DEBUG) console.log("Invalid column ids");
		return { tableId: null, data: null };
	}

	if (!hasValidRowIds(parsedTable)) {
		if (DEBUG) console.log("Invalid row ids");
		return { tableId: null, data: null };
	}

	if (DEBUG) {
		console.log("FOUND TABLE ID", tableId);
	}

	if (settings.appData[sourcePath]) {
		if (settings.appData[sourcePath][tableId]) {
			//This is a compatibility fix for v2.3.6 and less
			if (settings.appData[sourcePath][tableId].headers) {
				if (DEBUG) console.log("LOADING OLD DATA");

				const data = findAppData(parsedTable);
				const updated = updateAppDataFromSavedState(
					settings.appData[sourcePath][tableId],
					data
				);
				plugin.saveSettings();
				return { tableId, data: updated };
			}
		}
	}

	if (DEBUG) console.log("LOADING NEW DATA");
	return { tableId, data: findAppData(parsedTable) };
};
