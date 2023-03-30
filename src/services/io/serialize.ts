import NltPlugin from "../../main";

import type { MarkdownViewModeType, TFile } from "obsidian";

import { Cell, TableState } from "../table/types";
import { logVar } from "../debug";

export const FILE_NAME = "serialize";

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
