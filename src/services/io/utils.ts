import { Cell } from "../table/types";
import { TFile, TFolder } from "obsidian";
import NltPlugin from "../../main";

import { createEmptyMarkdownTable } from "../random";
import { SLASH_REGEX } from "../string/regex";

export const findTableFile = async (
	plugin: NltPlugin,
	tableId: string
): Promise<TFile | null> => {
	const tableFolder = plugin.settings.tableFolder;
	if (tableFolder.match(SLASH_REGEX))
		throw new Error(
			"Table definition folder cannot include forward or back slashes. Please change it in the plugin settings."
		);

	const folder = plugin.app.vault.getAbstractFileByPath(tableFolder);
	if (!folder) await plugin.app.vault.createFolder(tableFolder);

	const file = plugin.app.vault.getAbstractFileByPath(
		`${tableFolder}/${tableId}.md`
	);
	if (file && file instanceof TFile) return file;

	const createdFile = await plugin.app.vault.create(
		`${tableFolder}/${tableId}.md`,
		createEmptyMarkdownTable()
	);
	return createdFile;
};

export const initialCell = (
	id: string,
	columnId: string,
	rowId: string,
	markdown: string,
	html: string
): Cell => {
	return {
		id,
		columnId,
		rowId,
		markdown,
		html,
	};
};

export const getColumnIndex = (
	cellIndex: number,
	numColumns: number
): number => {
	return cellIndex - numColumns * Math.floor(cellIndex / numColumns);
};

export const getRowIndex = (cellIndex: number, numColumns: number): number => {
	return Math.ceil((cellIndex + 1) / numColumns) - 1;
};
