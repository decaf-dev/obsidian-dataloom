import NltPlugin from "../../main";

import type { MarkdownViewModeType, TFile } from "obsidian";

import { TableModel, Cell, TableState } from "../table/types";
import { findTableFile, serializeFrontMatter } from "./utils";
import { logVar } from "../debug";

export const FILE_NAME = "serialize";

/**
 * Produces markdown from the table model
 */
export const serializeMarkdownTable = (model: TableModel): string => {
	const { columnIds, rowIds, cells } = model;
	const columnCharLengths = calcColumnCharLengths(cells);
	const buffer = new TableModelStringBuffer();
	buffer.createRow();

	for (let i = 0; i < columnIds.length; i++) {
		const columnId = columnIds[i];
		const cell = cells.find((c) => c.columnId === columnId && c.isHeader);
		buffer.writeCell(cell.markdown, columnCharLengths[columnId]);
	}

	buffer.createRow();

	for (let i = 0; i < columnIds.length; i++) {
		const columnId = columnIds[i];
		let numChars =
			columnCharLengths[columnId] > 3 ? columnCharLengths[columnId] : 3;
		const content = Array(numChars).fill("-").join("");
		buffer.writeCell(content, numChars);
	}

	//Ignore header row
	for (let i = 1; i < rowIds.length; i++) {
		buffer.createRow();

		const rowId = rowIds[i];
		const rowCells = cells.filter((cell) => cell.rowId == rowId);
		for (let j = 0; j < rowCells.length; j++) {
			const { columnId, markdown } = rowCells[j];
			buffer.writeCell(markdown, columnCharLengths[columnId]);
		}
	}
	return buffer.toString();
};

export class TableModelStringBuffer {
	string: string;

	constructor() {
		this.string = "";
	}

	createRow() {
		if (this.string !== "") this.string += "\n";
		this.string += "|";
	}

	writeCell(content: string, columnCharLength: number) {
		this.string += " ";
		this.string += content;

		const numWhiteSpace = columnCharLength - content.length;

		//Pads the cell with white space
		for (let i = 0; i < numWhiteSpace; i++) this.string += " ";
		this.string += " ";
		this.string += "|";
	}

	toString() {
		return this.string;
	}
}

interface ColumnCharLengths {
	[columnId: string]: number;
}

/**
 * Calculates the max char length for each column.
 * This is used to know how much padding to add to cell.
 */
export const calcColumnCharLengths = (cells: Cell[]): ColumnCharLengths => {
	const columnCharLengths: ColumnCharLengths = {};

	for (let i = 0; i < cells.length; i++) {
		const { columnId, markdown } = cells[i];
		if (
			!columnCharLengths[columnId] ||
			columnCharLengths[columnId] < markdown.length
		) {
			columnCharLengths[columnId] = markdown.length;
		}
	}
	return columnCharLengths;
};

const updateSettingsCache = async (
	plugin: NltPlugin,
	state: TableState,
	tableId: string,
	viewModesToUpdate: MarkdownViewModeType[]
) => {
	const shouldDebug = plugin.settings.shouldDebug;
	const settingsCopy = { ...plugin.settings };
	settingsCopy.data = {
		...plugin.settings.data,
		[tableId]: state,
	};
	settingsCopy.viewModeSync = {
		tableId,
		viewModes: viewModesToUpdate,
		eventType: "update-state",
	};
	logVar(
		shouldDebug,
		FILE_NAME,
		"updateSettingsCache",
		"Updating settings with new table state",
		settingsCopy
	);
	plugin.settings = settingsCopy;
	return await plugin.saveData(plugin.settings);
};

export const updateFileContent = async (
	plugin: NltPlugin,
	file: TFile,
	content: string
) => {
	return await plugin.app.vault.modify(file, content);
};

export const updateSortTime = async (plugin: NltPlugin, tableId: string) => {
	const shouldDebug = plugin.settings.shouldDebug;
	const settingsCopy = { ...plugin.settings };
	settingsCopy.viewModeSync = {
		tableId,
		viewModes: ["source", "preview"],
		eventType: "sort-rows",
	};
	logVar(
		shouldDebug,
		FILE_NAME,
		"updateSortTime",
		"Updating settings file with new sync info",
		settingsCopy
	);
	plugin.settings = settingsCopy;
	return await plugin.saveData(plugin.settings);
};

export const serializeTableModel = async (
	plugin: NltPlugin,
	file: TFile,
	model: TableModel
) => {
	const shouldDebug = plugin.settings.shouldDebug;
	const frontmatter = serializeFrontMatter(model);
	const tableMarkdown = serializeMarkdownTable(model);

	const content = frontmatter + "\n\n" + tableMarkdown;
	logVar(
		shouldDebug,
		FILE_NAME,
		"serializeTableModel",
		"Updating table definition file",
		content
	);
	await updateFileContent(plugin, file, content);
};

export const serializeTable = async (
	shouldSaveModel: boolean,
	plugin: NltPlugin,
	state: TableState,
	tableId: string,
	viewModesToUpdate: MarkdownViewModeType[]
) => {
	const { model } = state;

	if (shouldSaveModel) {
		const { file } = await findTableFile(plugin, tableId);
		await serializeTableModel(plugin, file, model);
	}
	await updateSettingsCache(plugin, state, tableId, viewModesToUpdate);
};
