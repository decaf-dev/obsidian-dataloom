import { NltSettings } from "../../settings";
import NltPlugin from "main";
import { updateAppDataFromSavedState } from "./merge";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "src/app/constants";
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

	if (settings.excludedFiles.includes(sourcePath)) {
		console.log(`Excluding file path: ${sourcePath}`);
		return { tableIndex, data: null };
	}

	//Migration from before 3.4.0
	if (settings.appData[sourcePath]) {
		if (settings.appData[sourcePath][tableIndex]) {
			console.log("Migrating from before 3.4.0");
			const appData = settings.appData[sourcePath][tableIndex];
			settings.state[sourcePath] = {};
			settings.state[sourcePath][tableIndex] = {
				data: appData,
				viewType: "live-preview",
				shouldUpdate: false,
				tableCacheVersion: 340,
			};
			delete settings.appData[sourcePath][tableIndex];
			await plugin.saveSettings();
		}
	}

	if (settings.state[sourcePath]) {
		if (settings.state[sourcePath][tableIndex]) {
			const data = settings.state[sourcePath][tableIndex];
			let tableCacheVersion = data.tableCacheVersion;
			//Handle migration from before 4.1.0
			if (!tableCacheVersion) {
				console.log("Migrating from before 4.1.0");
				tableCacheVersion = 400;
			}
			if (tableCacheVersion < CURRENT_TABLE_CACHE_VERSION) {
				let obj = { ...settings.state[sourcePath][tableIndex] };
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
				if (tableCacheVersion < 412) {
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
				settings.state[sourcePath][tableIndex] = obj;
				await plugin.saveSettings();
			}
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
		tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};
	await plugin.saveSettings();
	return { tableIndex, data };
};
