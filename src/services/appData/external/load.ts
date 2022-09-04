import NltPlugin from "main";
import { updateAppDataFromSavedState } from "./merge";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "src/constants";
import { SortDir } from "../../sort/types";
import { AppData } from "../state/types";
import {
	findAppData,
	findCurrentViewType,
	parseTableFromEl,
} from "./loadUtils";

/**
 * Loads app data
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadAppData = async (
	plugin: NltPlugin,
	el: HTMLElement,
	blockId: string,
	sourcePath: string
): Promise<AppData> => {
	const parsedTable = parseTableFromEl(el);
	if (DEBUG.LOAD_APP_DATA) {
		console.log("");
		console.log("loadAppData()");
		console.log("Parsing table from element");
		console.log("parsed", parsedTable);
	}

	if (plugin.settings.excludedFiles.includes(sourcePath)) {
		console.log(`Excluding file path: ${sourcePath}`);
		return null;
	}

	//Migration from before 3.4.0
	if (plugin.settings.appData[sourcePath]) {
		if (plugin.settings.appData[sourcePath][0]) {
			console.log("Migrating from before 3.4.0");
			const appData = plugin.settings.appData[sourcePath][0];
			plugin.settings.state[sourcePath] = {};
			plugin.settings.state[sourcePath][0] = {
				data: appData,
				viewType: "live-preview",
				shouldUpdate: false,
				tableCacheVersion: 340,
			};
			delete plugin.settings.appData[sourcePath][0];
			await plugin.saveSettings();
		}
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

		if (plugin.settings.state[sourcePath][blockId]) {
			const data = plugin.settings.state[sourcePath][blockId];
			let tableCacheVersion = data.tableCacheVersion;
			//Handle migration from before 4.1.0
			if (!tableCacheVersion) {
				console.log("Migrating from before 4.1.0");
				tableCacheVersion = 400;
			}
			if (tableCacheVersion < CURRENT_TABLE_CACHE_VERSION) {
				let obj = { ...plugin.settings.state[sourcePath][blockId] };
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
				plugin.settings.state[sourcePath][blockId] = obj;
				await plugin.saveSettings();
			}
		}
	}

	if (plugin.settings.state[sourcePath]) {
		if (plugin.settings.state[sourcePath][blockId]) {
			if (plugin.settings.state[sourcePath][blockId].data) {
				const oldData = plugin.settings.state[sourcePath][blockId].data;
				if (DEBUG.LOAD_APP_DATA) {
					console.log("Loading data from cache.");
					console.log(
						"data",
						plugin.settings.state[sourcePath][blockId]
					);
				}

				const data = findAppData(parsedTable);
				return updateAppDataFromSavedState(oldData, data);
			}
		}
	}

	const data = findAppData(parsedTable);

	//When a user adds a new table, this entry will initially be null, we need to set this
	//so a user can add rows/columns via hotkeys
	plugin.settings.state[sourcePath] = {};

	let saveState = {
		data,
		shouldUpdate: false,
		viewType: findCurrentViewType(el),
		tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};
	plugin.settings.state[sourcePath][blockId] = saveState;

	if (DEBUG.LOAD_APP_DATA) {
		console.log("Loading new data.");
		console.log("data", saveState);
	}

	await plugin.saveSettings();
	return data;
};
