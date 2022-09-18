import { TFile } from "obsidian";

import NltPlugin from "../../main";

import { tableModelToMarkdown } from "./saveUtils";

import { MarkdownTable } from "./types";

import { TableModel, TableSettings, ViewType } from "../table/types";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "../../constants";

export const saveTableState = async (
	plugin: NltPlugin,
	tableData: TableModel,
	tableSettings: TableSettings,
	tableId: string,
	markdownTable: MarkdownTable,
	sourcePath: string,
	viewType: ViewType
) => {
	try {
		if (DEBUG.SAVE_APP_DATA) {
			console.log("");
			console.log("saveTableState()");
		}

		await updateSettingsCache(
			plugin,
			tableData,
			tableSettings,
			sourcePath,
			tableId,
			viewType
		);

		const markdown = tableModelToMarkdown(tableData);

		const { lineStart, lineEnd, text } = markdownTable;

		let tableModelChanged = text.localeCompare(markdown) !== 0;

		if (tableModelChanged) {
			if (DEBUG.SAVE_APP_DATA) {
				console.log("Table model changed");
			}

			const file = plugin.app.workspace.getActiveFile();
			const fileContent = await plugin.app.vault.cachedRead(file);

			const updatedContent = replaceTableInText(
				fileContent,
				lineStart,
				lineEnd,
				markdown
			);

			if (DEBUG.SAVE_APP_DATA) {
				console.log("table model", {
					updatedContent,
				});
				console.log("updated file content", {
					updatedContent,
				});
			}
			await updateFileContent(plugin, file, updatedContent);
		}
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
	tableModel: TableModel,
	tableSettings: TableSettings,
	sourcePath: string,
	tableId: string,
	viewType: ViewType
) => {
	plugin.settings.data[sourcePath][tableId] = {
		tableModel,
		tableSettings,
		viewType,
		shouldUpdate: true,
		tableCacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};
	if (DEBUG.SAVE_APP_DATA) {
		console.log("Updating settings cache");
		console.log("data", {
			[tableId]: plugin.settings.data[sourcePath][tableId],
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
