import { NltSettings } from "../../settings";
import NltPlugin from "main";
import { parseTableFromEl } from "./loadUtils";
import { mergeAppData } from "./merge";
import { isValidTypeDefinitionRow } from "../../string/validators";
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
	if (!isValidTypeDefinitionRow(parsedTable)) {
		if (DEBUG) console.log("Invalid type definition row");
		return { tableId: null, data: null };
	}

	if (DEBUG) {
		console.log("FOUND TABLE ID", tableId);
	}

	//Check to make sure it doesn't have errors
	if (settings.appData[sourcePath]) {
		if (settings.appData[sourcePath][tableId]) {
			if (DEBUG) console.log("LOADING OLD DATA");

			// TODO add merging back in
			const newAppData = findAppData(parsedTable);
			const merged = mergeAppData(
				settings.appData[sourcePath][tableId],
				newAppData
			);
			settings.appData[sourcePath][tableId] = merged;
			//TODO add await
			plugin.saveSettings();
			//Check to see if it has errors, if it does, don't return
			return { tableId, data: merged };
		}
	}

	if (DEBUG) console.log("LOADING NEW DATA");
	return { tableId, data: findAppData(parsedTable) };
};
