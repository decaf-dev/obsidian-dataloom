import NLTPlugin from "main";
import { updateAppDataFromSavedState } from "./merge";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "src/constants";
import { appDataToMarkdown } from "./saveUtils";
import { SortDir } from "../../sort/types";
import {
	findTableIndex,
	findAppData,
	findCurrentViewType,
	parseTableFromEl,
} from "./loadUtils";
import { LoadedData } from "../state/loadedData";
import { appDataIdsToMarkdown, appDataTypesToMarkdown } from "../debug";

/**
 * Loads app data
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadAppData = async (
	plugin: NLTPlugin,
	el: HTMLElement,
	sourcePath: string
): Promise<LoadedData> => {
	const parsedTable = parseTableFromEl(el);
	if (DEBUG.LOAD_APP_DATA.PARSED_TABLE) {
		console.log("[load][loadAppData]: parsedTableFromEl");
		console.log(parsedTable);
	}

	const tableIndex = findTableIndex(parsedTable[0]);

	if (plugin.settings.excludedFiles.includes(sourcePath)) {
		console.log(`Excluding file path: ${sourcePath}`);
		return { tableIndex, data: null };
	}

	//Migration from before 3.4.0
	if (plugin.settings.appData[sourcePath]) {
		if (plugin.settings.appData[sourcePath][tableIndex]) {
			console.log("Migrating from before 3.4.0");
			const appData = plugin.settings.appData[sourcePath][tableIndex];
			plugin.settings.state[sourcePath] = {};
			plugin.settings.state[sourcePath][tableIndex] = {
				data: appData,
				viewType: "live-preview",
				shouldUpdate: false,
				tableCacheVersion: 340,
			};
			delete plugin.settings.appData[sourcePath][tableIndex];
			await plugin.saveSettings();
		}
	}

	if (plugin.settings.state[sourcePath]) {
		if (plugin.settings.state[sourcePath][tableIndex]) {
			const data = plugin.settings.state[sourcePath][tableIndex];
			let tableCacheVersion = data.tableCacheVersion;
			//Handle migration from before 4.1.0
			if (!tableCacheVersion) {
				console.log("Migrating from before 4.1.0");
				tableCacheVersion = 400;
			}
			if (tableCacheVersion < CURRENT_TABLE_CACHE_VERSION) {
				let obj = { ...plugin.settings.state[sourcePath][tableIndex] };
				if (tableCacheVersion < 410) {
					obj = {
						...obj,
						data: {
							...obj.data,
							headers: obj.data.headers.map((header) => {
								return {
									...header,
									useAutoWidth: false,
									shouldWrapOverflow: true,
								};
							}),
						},
					};
				}
				if (tableCacheVersion < 420) {
					obj = {
						...obj,
						data: {
							...obj.data,
							headers: obj.data.headers.map((header) => {
								const obj = { ...header };
								obj.sortDir = obj.sortName as SortDir;
								delete obj.sortName;
								return obj;
							}),
						},
					};
				}
				obj = {
					...obj,
					tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
				};
				plugin.settings.state[sourcePath][tableIndex] = obj;
				await plugin.saveSettings();
			}
		}
	}

	const viewType = findCurrentViewType(el);
	if (plugin.settings.state[sourcePath]) {
		if (plugin.settings.state[sourcePath][tableIndex]) {
			if (plugin.settings.state[sourcePath][tableIndex].data) {
				const oldData =
					plugin.settings.state[sourcePath][tableIndex].data;
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
	plugin.settings.state[sourcePath] = {};
	plugin.settings.state[sourcePath][tableIndex] = {
		data,
		shouldUpdate: false,
		viewType: findCurrentViewType(el),
		tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};
	await plugin.saveSettings();
	return { tableIndex, data };
};
