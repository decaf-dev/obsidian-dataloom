import { v4 as uuidv4 } from "uuid";
import { App, TFile } from "obsidian";
import { NltSettings } from "../../services/state";
import crc32 from "crc-32";

import { AppData } from "../../services/state";
import {
	addPound,
	findAppData,
	parseTableFromEl,
	findMarkdownTablesFromFileData,
	validTypeDefinitionRow,
	hashParsedTable,
} from "../../services/utils";

import { Header, Tag, Row, Cell } from "../../services/state";

import { CELL_TYPE, DEBUG } from "../../constants";
import NltPlugin from "main";

/**
 * Loads app data
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadAppData = (
	plugin: NltPlugin,
	app: App,
	settings: NltSettings,
	el: HTMLElement,
	sourcePath: string
): AppData | null => {
	const parsedTable = parseTableFromEl(el);
	const hash = hashParsedTable(parsedTable);

	//Check settings file for old data
	if (settings.appData[sourcePath]) {
		//Just in time garbage collection for old tables
		pruneAppData(app, settings, sourcePath);
		if (settings.appData[sourcePath][hash]) {
			if (DEBUG) {
				console.log("Found persisted data for hash:", hash);
				console.log(settings.appData[sourcePath][hash]);
			}
			return settings.appData[sourcePath][hash];
		}
	}

	//If we don't have a type definition row return null
	if (!validTypeDefinitionRow(parsedTable)) return null;

	let data = findAppData(parsedTable);
	//When we find the data, save it in the cache immediately
	//USE CASE:
	//if a user makes a table with tags but never edits it
	//they can open and close the app and the tags will change colors
	persistAppData(plugin, settings, data, sourcePath);
	return data;
};

const pruneAppData = async (
	app: App,
	settings: NltSettings,
	sourcePath: string
) => {
	const file = app.vault.getAbstractFileByPath(sourcePath);
	if (file instanceof TFile) {
		const fileData = await app.vault.read(file);
		const tables = findMarkdownTablesFromFileData(fileData).map(
			(tableData) =>
				tableData
					.replace(/\s/g, "")
					.replace(/[---]+\|/g, "") //Replace where at least 3 hyphens exist
					.replace(/\|/g, "")
		);

		console.log(tables);

		const tableHashes: number[] = tables.map((table) => {
			return crc32.str(table);
		});

		const hashes: number[] = Object.keys(settings.appData[sourcePath]).map(
			(key) => parseInt(key)
		);
		//Iterate over each hash. If our table hashes don't include that hash
		//then delete it from the settings
		hashes.forEach((hash: number) => {
			console.log("OLD HASHES");
			console.log(hash);
			console.log(tableHashes);
			if (!tableHashes.includes(hash)) {
				if (DEBUG) {
					console.log("Deleting old data from settings", hash);
				}
				//Mark for deletion
				delete settings.appData[sourcePath][hash];

				if (DEBUG) {
					console.log("New settings:");
					console.log(settings.appData[sourcePath]);
				}
			}
		});
	}
};

const persistAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string
) => {
	const formatted = appDataToString(appData)
		.replace(/\s/g, "")
		.replace(/[---]+\|/g, "") //Replace where at least 3 hyphens exist
		.replace(/\|/g, "");
	const hash = crc32.str(formatted);
	if (!settings.appData[sourcePath]) settings.appData[sourcePath] = {};
	settings.appData[sourcePath][hash] = appData;
	plugin.saveData(settings);
};

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
	sourcePath: string
) => {
	const newData = appDataToString(newAppData);
	if (DEBUG) {
		const oldData = appDataToString(oldAppData);
		console.log("OLD DATA");
		console.log(oldData);
		console.log("NEW DATA");
		console.log(newData);
	}
	try {
		const file = app.workspace.getActiveFile();
		let content = await app.vault.read(file);

		content = content.replace(
			findTableRegex(oldAppData.headers, oldAppData.rows),
			newData
		);

		//Reset update time to 0 so we don't update on load
		newAppData.updateTime = 0;
		persistAppData(plugin, settings, newAppData, sourcePath);

		//Save the open file with the new table data
		app.vault.modify(file, content);
	} catch (err) {
		console.log(err);
	}
};

/**
 * Finds a regex that will match a table based on header content, type definition row,
 * and number of cells
 * @param headers The headers
 * @param rows The rows
 * @returns A regex that matches this table
 */
export const findTableRegex = (headers: Header[], rows: Row[]): RegExp => {
	const regex: string[] = [];
	regex[0] = "\\|";
	regex[0] += headers.map((header) => `.*${header.content}.*\\|`).join("");

	//Hyphen row, type definition row, and then all other rows
	for (let i = 0; i < rows.length + 2; i++) regex[i + 1] = "\\|.*\\|";

	const expression = new RegExp(regex.join("\n"));
	return expression;
};

/**
 * Converts app data to a valid Obsidian markdown string
 * @param data The app data
 * @returns An Obsidian markdown string
 */
export const appDataToString = (data: AppData): string => {
	const columnCharLengths = calcColumnCharLengths(
		data.headers,
		data.cells,
		data.tags
	);

	let fileData = "|";

	data.headers.forEach((header, i) => {
		fileData = writeMarkdownTableCell(
			fileData,
			header.content,
			columnCharLengths[i]
		);
	});

	fileData += "\n";

	for (let i = 0; i < data.headers.length; i++) {
		const content = Array(columnCharLengths[i]).fill("-").join("");
		fileData = writeMarkdownTableCell(
			fileData,
			content,
			columnCharLengths[i]
		);
	}

	fileData += "\n";

	data.headers.forEach((header, i) => {
		fileData = writeMarkdownTableCell(
			fileData,
			header.type,
			columnCharLengths[i]
		);
	});

	data.rows.forEach((row) => {
		fileData += "\n";

		//TODO fix when I add the ability to drag columns
		//I will probably need to sort the cells
		const cells = data.cells.filter((cell) => cell.rowId === row.id);
		cells.forEach((cell, j) => {
			if (
				cell.type === CELL_TYPE.TAG ||
				cell.type === CELL_TYPE.MULTI_TAG
			) {
				const tags = data.tags.filter((tag) =>
					tag.selected.includes(cell.id)
				);

				let content = "";

				tags.forEach((tag, i) => {
					if (tag.content === "") return;
					if (i === 0) content += addPound(tag.content);
					else content += " " + addPound(tag.content);
				});
				fileData = writeMarkdownTableCell(
					fileData,
					content,
					columnCharLengths[j]
				);
			} else {
				fileData = writeMarkdownTableCell(
					fileData,
					cell.content,
					columnCharLengths[j]
				);
			}
		});
	});
	return fileData;
};

export const writeMarkdownTableCell = (
	data: string,
	contentToWrite: string,
	columnCharacters: number
) => {
	//If we're starting a new row
	if (data[data.length - 1] === "\n") data += "|";

	data += " ";
	data += contentToWrite;

	const numWhiteSpace = columnCharacters - contentToWrite.length;

	//Pads the cell with white space
	for (let i = 0; i < numWhiteSpace; i++) data += " ";
	data += " ";
	data += "|";
	return data;
};

/**
 * Calculates the max char length for each column.
 * This is used to know how much padding to add to cell.
 * @param headers An array of headers
 * @param cells An array of cells
 * @param tags An array of tags
 * @returns An object containing the calculated lengths
 */
export const calcColumnCharLengths = (
	headers: Header[],
	cells: Cell[],
	tags: Tag[]
): { [columnPosition: number]: number } => {
	const columnCharLengths: { [columnPosition: number]: number } = [];

	//Check headers
	headers.forEach((header, i) => {
		columnCharLengths[i] = header.content.length;
	});

	//Check types
	Object.values(CELL_TYPE).forEach((type, i) => {
		if (columnCharLengths[i] < type.length)
			columnCharLengths[i] = type.length;
	});

	//Check cells
	cells.forEach((cell, i) => {
		if (cell.type === CELL_TYPE.TAG || cell.type === CELL_TYPE.MULTI_TAG) {
			const arr = tags.filter((tag) => tag.selected.includes(cell.id));

			//TODO edit for multi-tag
			//Do we want the tags on one line?
			let content = "";
			arr.forEach((tag, i) => {
				if (tag.content === "") return;
				if (i === 0) content += addPound(tag.content);
				else content += " " + addPound(tag.content);
			});
			if (columnCharLengths[cell.position] < content.length)
				columnCharLengths[cell.position] = content.length;
		} else {
			if (columnCharLengths[cell.position] < cell.content.length)
				columnCharLengths[cell.position] = cell.content.length;
		}
	});
	return columnCharLengths;
};
