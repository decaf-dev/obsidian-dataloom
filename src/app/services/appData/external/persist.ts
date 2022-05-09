import { AppData } from "../state/appData";
import { NltSettings } from "../../settings";
import NltPlugin from "../../../../../main";
import { AppSaveState } from "../state/appSaveState";

export const persistAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string,
	tableId: string
) => {
	if (!settings.appData[sourcePath]) settings.appData[sourcePath] = {};
	const saveState: AppSaveState = {
		headers: {},
		rows: {},
	};

	appData.headers.forEach((header) => {
		saveState.headers[header.id] = {
			width: header.width,
			sortName: header.sortName,
			tags: Object.fromEntries(
				appData.tags.map((tag) => [tag.content, { color: tag.color }])
			),
		};
	});
	appData.rows.forEach((row) => {
		saveState.rows[row.id] = {
			creationTime: row.creationTime,
		};
	});
	settings.appData[sourcePath][tableId] = saveState;
	plugin.saveData(settings);
};
