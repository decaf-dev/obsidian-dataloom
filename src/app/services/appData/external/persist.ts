import { AppData } from "../state/appData";
import { NltSettings } from "../../settings";
import NltPlugin from "../../../../../main";
import { ViewType } from "../state/saveState";
import { CURRENT_TABLE_CACHE_VERSION } from "src/app/constants";

export const persistAppData = async (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string,
	tableIndex: string,
	viewType: ViewType
) => {
	if (!settings.state[sourcePath]) settings.state[sourcePath] = {};
	settings.state[sourcePath][tableIndex] = {
		data: appData,
		viewType,
		shouldUpdate: true,
		tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};
	await plugin.saveData(settings);
};
