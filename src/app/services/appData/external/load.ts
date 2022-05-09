import { NltSettings } from "../../settings";
import NltPlugin from "main";
import { parseTableFromEl } from "./loadUtils";
import { mergeAppData } from "./merge";
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
			if (DEBUG) console.log("LOADING OLD DATA");

			//We merge because if a user adds to the markdown, or takes away from the markdown
			//we want to handle those updates
			const newAppData = findAppData(parsedTable);
			// const merged = mergeAppData(
			// 	settings.appData[sourcePath][tableId],
			// 	newAppData
			// );
			settings.appData[sourcePath][tableId] = newAppData;
			//TODO add await
			plugin.saveSettings();
			//Check to see if it has errors, if it does, don't return
			return { tableId, data: newAppData };
		}
	}

	if (DEBUG) console.log("LOADING NEW DATA");
	return { tableId, data: findAppData(parsedTable) };
};
