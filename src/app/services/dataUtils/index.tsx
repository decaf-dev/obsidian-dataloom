import { App } from "obsidian";
import { NltSettings } from "../../services/state";

import { AppData } from "../../services/state";
import {
	findAppData,
	appDataToMarkdown,
	findTableRegex,
	parseTableFromEl,
	validTypeDefinitionRow,
	findTableId,
} from "../../services/utils";

import { DEBUG } from "../../constants";

import NltPlugin from "main";

interface LoadedData {
	tableId: string;
	data: AppData;
}

/**
 * Loads app data
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadAppData = (
	settings: NltSettings,
	el: HTMLElement,
	sourcePath: string
): LoadedData | null => {
	const parsedTable = parseTableFromEl(el);
	console.log(parsedTable);

	const tableId = findTableId(parsedTable);
	if (!tableId) return null;
	if (!validTypeDefinitionRow(parsedTable)) return null;

	if (DEBUG) {
		console.log("FOUND TABLE ID", tableId);
		console.log("LOADING DATA");
	}

	if (settings.appData[sourcePath]) {
		if (settings.appData[sourcePath][tableId]) {
			if (DEBUG) console.log("LOADING OLD DATA");

			//TODO merge new data with old data
			// const newAppData =
			// 	findAppData(parsedTable);
			// const merged = mergeAppData(
			// 	this.settings.appData[file.path][
			// 		key
			// 	],
			// 	newAppData
			// );
			// this.settings.appData[file.path][hash] =
			// 	merged;
			// delete this.settings.appData[file.path][
			// 	key
			// ];
			// console.log(
			// 	"REPLACING OLD DATA WITH NEW DATA"
			// );
			// console.log(newAppData.updateTime);
			// this.saveSettings();
			return { tableId, data: settings.appData[sourcePath][tableId] };
		}
	}

	if (DEBUG) console.log("LOADING NEW DATA");
	return { tableId, data: findAppData(parsedTable) };
};

const persistAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string,
	tableId: string
) => {
	if (!settings.appData[sourcePath]) settings.appData[sourcePath] = {};
	if (DEBUG) console.log("PERSISTING APP DATA");
	settings.appData[sourcePath][tableId] = appData;
	plugin.saveData(settings);
};

/**
 * Saves app data
 * @param plugin
 * @param settings
 * @param app
 * @param oldAppData
 * @param newAppData
 */
export const saveAppData = async (
	plugin: NltPlugin,
	settings: NltSettings,
	app: App,
	oldAppData: AppData,
	newAppData: AppData,
	sourcePath: string,
	tableId: string
) => {
	const newData = appDataToMarkdown(tableId, newAppData);
	try {
		const file = app.workspace.getActiveFile();
		let content = await app.vault.cachedRead(file);

		content = content.replace(
			findTableRegex(tableId, oldAppData.headers, oldAppData.rows),
			newData
		);

		//Reset update time to 0 so we don't update on load
		newAppData.updateTime = 0;
		persistAppData(plugin, settings, newAppData, sourcePath, tableId);

		//Save the open file with the new table data
		await app.vault.modify(file, content);
	} catch (err) {
		console.log(err);
	}
};
