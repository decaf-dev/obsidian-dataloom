import { AppData } from "../state/appData";
import { NltSettings } from "../../settings";
import NltPlugin from "../../../../../main";
import { ViewType } from "../state/saveState";

export const persistAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string,
	tableId: string,
	viewType: ViewType
) => {
	if (!settings.state[sourcePath]) settings.state[sourcePath] = {};
	settings.state[sourcePath][tableId] = {
		data: appData,
		viewType,
		shouldUpdate: true,
	};
	plugin.saveData(settings);
};
