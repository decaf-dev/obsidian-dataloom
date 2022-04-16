import { App, TFile } from "obsidian";
import { NltSettings } from "../../services/state";
import crc32 from "crc-32";

import { AppData } from "../../services/state";
import {
	findAppData,
	appDataToString,
	findTableRegex,
	parseTableFromEl,
	validTypeDefinitionRow,
	hashParsedTable,
	pruneSettingsCache,
} from "../../services/utils";

import { DEBUG } from "../../constants";
import NltPlugin from "main";

/**
 * Loads app data
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadAppData = (
	plugin: NltPlugin,
	app: App,
	settings: NltSettings,
	el: HTMLElement,
	sourcePath: string
): AppData | null => {
	const parsedTable = parseTableFromEl(el);
	const hash = hashParsedTable(parsedTable);

	if (settings.appData[sourcePath]) {
		//Just in time garbage collection for old tables
		garbageCollect(plugin, app, settings, sourcePath);
		if (settings.appData[sourcePath][hash])
			return settings.appData[sourcePath][hash];
	}

	//If we don't have a type definition row return null
	if (!validTypeDefinitionRow(parsedTable)) return null;

	let data = findAppData(parsedTable);
	//When we find the data, save it in the cache immediately
	//USE CASE:
	//if a user makes a table with tags but never edits it
	//they can open and close the app and the tags will change colors
	persistAppData(plugin, settings, data, sourcePath);
	return data;
};

const garbageCollect = async (
	plugin: NltPlugin,
	app: App,
	settings: NltSettings,
	sourcePath: string
) => {
	const file = app.vault.getAbstractFileByPath(sourcePath);
	if (file instanceof TFile) {
		const fileData = await app.vault.read(file);
		const newSettings = pruneSettingsCache(settings, sourcePath, fileData);
		plugin.saveData(newSettings);
	}
};

const persistAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string
) => {
	const formatted = appDataToString(appData)
		.replace(/\s/g, "")
		.replace(/[---]+\|/g, "") //Replace where at least 3 hyphens exist
		.replace(/\|/g, "");
	const hash = crc32.str(formatted);
	if (!settings.appData[sourcePath]) {
		console.log("Setting empty path");
		settings.appData[sourcePath] = {};
	}
	settings.appData[sourcePath][hash] = appData;
	console.log("Persisting data", hash);
	console.log(appData);
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
	sourcePath: string
) => {
	const newData = appDataToString(newAppData);
	try {
		const file = app.workspace.getActiveFile();
		let content = await app.vault.read(file);

		content = content.replace(
			findTableRegex(oldAppData.headers, oldAppData.rows),
			newData
		);

		//Reset update time to 0 so we don't update on load
		newAppData.updateTime = 0;
		persistAppData(plugin, settings, newAppData, sourcePath);

		//Save the open file with the new table data
		app.vault.modify(file, content);
	} catch (err) {
		console.log(err);
	}
};
