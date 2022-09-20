import NltPlugin from "../../main";

import { TFile } from "obsidian";

import { TableModel, TableSettings, Cell } from "../table/types";
import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "../../constants";
import { findTableFile, serializeFrontMatter } from "./utils";

/**
 * Produces markdown from the table model
 */
export const serializeMarkdownTable = (model: TableModel): string => {
	const { columns, rows, cells } = model;
	const columnCharLengths = calcColumnCharLengths(cells);
	const buffer = new TableModelStringBuffer();
	buffer.createRow();

	for (let i = 0; i < columns.length; i++) {
		buffer.writeCell(cells[i].markdown, columnCharLengths[i]);
	}

	buffer.createRow();

	for (let i = 0; i < columns.length; i++) {
		const columnId = columns[i];
		let numChars =
			columnCharLengths[columnId] > 3 ? columnCharLengths[columnId] : 3;
		const content = Array(numChars).fill("-").join("");
		buffer.writeCell(content, numChars);
	}

	//Ignore header row
	for (let i = 1; i < rows.length; i++) {
		buffer.createRow();

		const rowId = rows[i];
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
	model: TableModel,
	settings: TableSettings,
	tableId: string
) => {
	plugin.settings.data[tableId] = {
		model,
		settings,
		cacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};
	if (DEBUG.SAVE_APP_DATA) {
		console.log("Updating settings cache");
		console.log("data", {
			[tableId]: plugin.settings.data[tableId],
		});
	}
	return await plugin.saveData(plugin.settings);
};

const updateFileContent = async (
	plugin: NltPlugin,
	file: TFile,
	content: string
) => {
	return await plugin.app.vault.modify(file, content);
};

export const serializeTable = async (
	saveModel: boolean,
	plugin: NltPlugin,
	model: TableModel,
	settings: TableSettings,
	tableId: string
) => {
	if (DEBUG.SAVE_APP_DATA) {
		console.log("");
		console.log("serializeTable()");
	}

	if (saveModel) {
		if (DEBUG.SAVE_APP_DATA) console.log("Updating table definition file.");
		const file = await findTableFile(plugin, tableId);
		const frontmatter = serializeFrontMatter(model);
		const tableMarkdown = serializeMarkdownTable(model);
		if (DEBUG.SAVE_APP_DATA) {
			console.log("frontmatter\n", frontmatter);
			console.log("table markdown\n", tableMarkdown);
		}
		await updateFileContent(
			plugin,
			file,
			frontmatter + "\n" + tableMarkdown
		);
	}
	await updateSettingsCache(plugin, model, settings, tableId);
};
