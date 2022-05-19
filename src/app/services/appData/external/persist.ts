import { AppData } from "../state/appData";
import { NltSettings } from "../../settings";
import NltPlugin from "../../../../../main";
import { ViewType } from "../state/saveData";

export const persistAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string,
	tableId: string,
	viewType: ViewType
) => {
	if (!settings.appData[sourcePath]) settings.appData[sourcePath] = {};
	settings.appData[sourcePath][tableId] = {
		data: appData,
		viewType,
		shouldUpdate: true,
	};
	plugin.saveData(settings);
};
