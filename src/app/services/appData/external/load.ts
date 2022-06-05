import { NltSettings } from "../../settings";
import NltPlugin from "main";
import { findCurrentViewType, parseTableFromEl } from "./loadUtils";
import { updateAppDataFromSavedState } from "./merge";
import { DEBUG } from "src/app/constants";
import { appDataToMarkdown, findAppData } from "./saveUtils";
import { findTableIndex } from "./loadUtils";
import { LoadedData } from "../state/loadedData";
import { appDataIdsToMarkdown, appDataTypesToMarkdown } from "../debug";

/**
 * Loads app data
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadAppData = async (
	plugin: NltPlugin,
	settings: NltSettings,
	el: HTMLElement,
	sourcePath: string
): Promise<LoadedData> => {
	const parsedTable = parseTableFromEl(el);
	if (DEBUG.LOAD_APP_DATA.PARSED_TABLE) {
		console.log("[load][loadAppData]: parsedTableFromEl");
		console.log(parsedTable);
	}

	const tableIndex = findTableIndex(parsedTable[0]);

	//Migration from 3.4.0
	if (settings.appData[sourcePath]) {
		if (settings.appData[sourcePath][tableIndex]) {
			const data = settings.appData[sourcePath][tableIndex];
			settings.state[sourcePath] = {};
			settings.state[sourcePath][tableIndex] = {
				data,
				viewType: "live-preview",
				shouldUpdate: false,
			};
			delete settings.appData[sourcePath][tableIndex];
			await plugin.saveSettings();
		}
	}

	const viewType = findCurrentViewType(el);
	if (settings.state[sourcePath]) {
		if (settings.state[sourcePath][tableIndex]) {
			if (settings.state[sourcePath][tableIndex].data) {
				const oldData = settings.state[sourcePath][tableIndex].data;
				if (DEBUG.LOAD_APP_DATA.DATA) {
					console.log("[load]: loadAppData");
					console.log("Loading from cache.");
					console.log(`Table: ${tableIndex}, View: ${viewType}`);
					console.log(oldData);
				}

				const data = findAppData(parsedTable);
				const updated = updateAppDataFromSavedState(oldData, data);
				if (DEBUG.LOAD_APP_DATA.IDS)
					console.log(appDataIdsToMarkdown(data));
				if (DEBUG.LOAD_APP_DATA.TYPES)
					console.log(appDataTypesToMarkdown(data));
				if (DEBUG.LOAD_APP_DATA.MARKDOWN)
					console.log(appDataToMarkdown(data));
				return { tableIndex, data: updated };
			}
		}
	}

	const data = findAppData(parsedTable);
	if (DEBUG.LOAD_APP_DATA.DATA) {
		console.log("[load]: loadAppData");
		console.log("Loading new.");
		console.log(`Table: ${tableIndex}, View: ${viewType}`);
		console.log(data);
	}

	if (DEBUG.LOAD_APP_DATA.IDS) console.log(appDataIdsToMarkdown(data));
	if (DEBUG.LOAD_APP_DATA.TYPES) console.log(appDataTypesToMarkdown(data));
	if (DEBUG.LOAD_APP_DATA.MARKDOWN) console.log(appDataToMarkdown(data));

	//When a user adds a new table, this entry will initially be null, we need to set this
	//so a user can add rows/columns via hotkeys
	settings.state[sourcePath] = {};
	settings.state[sourcePath][tableIndex] = {
		data,
		shouldUpdate: false,
		viewType: findCurrentViewType(el),
	};
	await plugin.saveSettings();
	return { tableIndex, data };
};
