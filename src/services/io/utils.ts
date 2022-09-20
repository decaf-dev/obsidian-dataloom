import { Cell } from "../table/types";
import { TFile } from "obsidian";
import NltPlugin from "../../main";

import { createEmptyMarkdownTable } from "../random";

export const findTableFile = async (
	plugin: NltPlugin,
	tableId: string
): Promise<TFile | null> => {
	const file = plugin.app.vault.getAbstractFileByPath(
		`${plugin.settings.tableFolder}/${tableId}.md`
	);
	if (file && file instanceof TFile) {
		return file;
	}
	const createdFile = await plugin.app.vault.create(
		`${plugin.settings.tableFolder}/${tableId}.md`,
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
