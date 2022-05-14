import { AppData } from "../state/appData";
import { NltSettings } from "../../settings";
import NltPlugin from "../../../../../main";

export const persistAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string,
	tableId: string
) => {
	if (!settings.appData[sourcePath]) settings.appData[sourcePath] = {};
	settings.appData[sourcePath][tableId] = appData;
	plugin.saveData(settings);
};
