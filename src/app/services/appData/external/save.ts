import { AppData } from "../state/appData";
import { appDataToMarkdown, findTableRegex } from "./saveUtils";
import { App } from "obsidian";
import { NltSettings } from "../../settings";
import { persistAppData } from "./persist";
import NltPlugin from "../../../../../main";
import { DEBUG } from "src/app/constants";

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
	tableId: string
) => {
	const markdown = appDataToMarkdown(tableId, newAppData);
	try {
		const file = app.workspace.getActiveFile();
		let content = await app.vault.cachedRead(file);

		content = content.replace(
			findTableRegex(tableId, oldAppData.headers, oldAppData.rows),
			markdown
		);

		if (DEBUG.SAVE_APP_DATA.LOG_MESSAGE) {
			console.log("Saving data");
			if (DEBUG.SAVE_APP_DATA.APP_DATA) {
				console.log("New app data:");
				console.log(markdown);
			}
			if (DEBUG.SAVE_APP_DATA.TABLE_REGEX) {
				console.log("Table regex:");
				console.log(
					findTableRegex(tableId, oldAppData.headers, oldAppData.rows)
				);
			}
			if (DEBUG.SAVE_APP_DATA.UPDATED_CONTENT) {
				console.log("Updated content:");
				console.log(content);
			}
		}

		//Reset update time to 0 so we don't update on load
		newAppData.updateTime = 0;
		persistAppData(plugin, settings, newAppData, sourcePath, tableId);

		//Save the open file with the new table data
		await app.vault.modify(file, content);
	} catch (err) {
		console.log(err);
	}
};
