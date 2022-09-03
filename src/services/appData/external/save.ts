import { TableModel } from "../state/types";
import { appDataToMarkdown } from "./saveUtils";
import NLTPlugin from "../../../../main";
import { DEBUG } from "src/constants";
import { ViewType } from "../state/saveState";
import { CURRENT_TABLE_CACHE_VERSION } from "src/constants";
import { MarkdownSectionInformation, TFile } from "obsidian";

// const SHOULD_DEBUG = DEBUG.SAVE_APP_DATA;

export const saveAppData = async (
	plugin: NLTPlugin,
	data: TableModel,
	tableIndex: string,
	sectionInfo: MarkdownSectionInformation,
	sourcePath: string,
	viewType: ViewType
) => {
	try {
		//If changed
		const markdown = appDataToMarkdown(data);
		const file = plugin.app.workspace.getActiveFile();
		const fileContent = await plugin.app.vault.cachedRead(file);

		const { lineStart, lineEnd } = sectionInfo;

		const updatedContent = replaceTableInText(
			fileContent,
			lineStart,
			lineEnd,
			markdown
		);

		//If changed
		await updateSettingsCache(
			plugin,
			data,
			sourcePath,
			tableIndex,
			viewType
		);

		await updateFile(plugin, file, updatedContent);
	} catch (err) {
		console.log(err);
	}
};

const updateFile = async (
	plugin: NLTPlugin,
	file: TFile,
	updatedContent: string
) => {
	return await plugin.app.vault.modify(file, updatedContent);
};

const updateSettingsCache = async (
	plugin: NLTPlugin,
	data: TableModel,
	sourcePath: string,
	tableIndex: string,
	viewType: ViewType
) => {
	if (!plugin.settings.state[sourcePath])
		plugin.settings.state[sourcePath] = {};
	plugin.settings.state[sourcePath][tableIndex] = {
		data,
		viewType,
		shouldUpdate: true,
		tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};
	await plugin.saveData(plugin.settings);
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
