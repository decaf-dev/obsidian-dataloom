import { AppData } from "../state/appData";
import { appDataToMarkdown, findTableRegex } from "./saveUtils";
import { App } from "obsidian";
import { NltSettings } from "../../settings";
import { persistAppData } from "./persist";
import NltPlugin from "../../../../../main";
import { DEBUG } from "src/app/constants";
import { ViewType } from "../state/saveData";

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
	tableId: string,
	viewType: ViewType
) => {
	const markdown = appDataToMarkdown(tableId, newAppData);
	try {
		const file = app.workspace.getActiveFile();
		let content = await app.vault.cachedRead(file);

		content = content.replace(
			findTableRegex(tableId, oldAppData.headers, oldAppData.rows),
			markdown
		);

		if (DEBUG.SAVE_APP_DATA.APP_DATA) {
			console.log("saveAppData - New app data:");
			console.log(markdown);
		}

		persistAppData(
			plugin,
			settings,
			newAppData,
			sourcePath,
			tableId,
			viewType
		);

		//Save the open file with the new table data
		await app.vault.modify(file, content);
	} catch (err) {
		console.log(err);
	}
};
