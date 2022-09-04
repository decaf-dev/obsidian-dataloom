import { MarkdownSectionInformation, TFile } from "obsidian";

import NltPlugin from "../../../../main";

import { appDataToMarkdown } from "./saveUtils";

import { ViewType } from "../state/saveState";
import { AppData } from "../state/types";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "src/constants";

// const SHOULD_DEBUG = DEBUG.SAVE_APP_DATA;

//TODO optimize in the future?
//How much weight does this function have?
export const saveAppData = async (
	plugin: NltPlugin,
	data: AppData,
	blockId: string,
	sectionInfo: MarkdownSectionInformation,
	sourcePath: string,
	viewType: ViewType
) => {
	try {
		const markdown = appDataToMarkdown(data);

		if (DEBUG.SAVE_APP_DATA) {
			console.log("");
			console.log("saveAppData()");
			console.log("new table markdown", {
				markdown,
			});
		}
		const file = plugin.app.workspace.getActiveFile();
		const fileContent = await plugin.app.vault.cachedRead(file);

		const { lineStart, lineEnd } = sectionInfo;

		const updatedContent = replaceTableInText(
			fileContent,
			lineStart,
			lineEnd,
			markdown
		);

		if (DEBUG.SAVE_APP_DATA) {
			console.log("updated file content", {
				updatedContent,
			});
		}

		await updateSettingsCache(plugin, data, sourcePath, blockId, viewType);
		await updateFileContent(plugin, file, updatedContent);
	} catch (err) {
		console.log(err);
	}
};

const updateFileContent = async (
	plugin: NltPlugin,
	file: TFile,
	updatedContent: string
) => {
	return await plugin.app.vault.modify(file, updatedContent);
};

const updateSettingsCache = async (
	plugin: NltPlugin,
	data: AppData,
	sourcePath: string,
	blockId: string,
	viewType: ViewType
) => {
	if (!plugin.settings.state[sourcePath])
		plugin.settings.state[sourcePath] = {};
	plugin.settings.state[sourcePath][blockId] = {
		data,
		viewType,
		shouldUpdate: true,
		tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};
	if (DEBUG.SAVE_APP_DATA) {
		console.log("Updating settings cache");
		console.log("data", {
			[blockId]: plugin.settings.state[sourcePath][blockId],
		});
	}
	return await plugin.saveData(plugin.settings);
};

export const replaceTableInText = (
	text: string,
	lineStart: number,
	lineEnd: number,
	replacement: string
) => {
	const lines = text.split("\n");

	let start = lines.filter((_line, i) => i < lineStart).join("\n");
	if (start !== "") start += "\n";

	let end = lines.filter((_line, i) => i > lineEnd).join("\n");
	if (end !== "") end = "\n" + end;
	return start + replacement + end;
};
