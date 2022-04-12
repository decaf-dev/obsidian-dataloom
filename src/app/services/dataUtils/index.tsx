import { v4 as uuidv4 } from "uuid";
import { App, TFile } from "obsidian";
import { NltSettings } from "../../services/state";
import crc32 from "crc-32";

import { AppData, ErrorData } from "../../services/state";

import {
	Header,
	Tag,
	Row,
	Cell,
	initialHeader,
	initialCell,
	initialRow,
	initialTag,
} from "../../services/state";
import { randomColor } from "../../services/utils";

import { CELL_TYPE, DEBUG } from "../../constants";
import NltPlugin from "main";

/**
 * Validates the type definition row of the table and returns ErrorData if not valid
 * @param el The html element received from the MarkdownPostProcessor
 * This is a normally rendered Obsidian markdown table
 * @returns The ErrorData
 */
export const findErrorData = (el: HTMLElement): ErrorData | null => {
	const tr = el.querySelectorAll("tr");
	//Get the type definition row
	const typeRowEl = tr[1];

	if (typeRowEl) {
		const td = typeRowEl.querySelectorAll("td");

		const errors: number[] = [];

		td.forEach((td, i) => {
			const cellType = td.textContent;
			if (
				cellType !== CELL_TYPE.TEXT &&
				cellType != CELL_TYPE.NUMBER &&
				cellType !== CELL_TYPE.TAG
			)
				errors.push(i);
		});

		if (errors.length === 0) {
			//No error
			return null;
		} else {
			//There are type definition errors
			return { columnIds: errors };
		}
	} else {
		//Type definition row didn't exist
		return { columnIds: [] };
	}
};

export const findAppData = (
	el: HTMLElement,
	settings: NltSettings
): AppData => {
	const headers: Header[] = [];
	const rows: Row[] = [];
	const cells: Cell[] = [];
	const tags: Tag[] = [];

	const th = el.querySelectorAll("th");
	th.forEach((header, i) => {
		headers.push(initialHeader(header.textContent, i));
	});

	const tr = el.querySelectorAll("tr");
	tr.forEach((tr, i) => {
		//The thead will contain a row, so we want to ignore that
		if (i === 0) return;

		const rowId = uuidv4();

		//Only parse from below the type row
		if (i !== 1) {
			rows.push(initialRow(rowId));
		}

		const td = tr.querySelectorAll("td");
		td.forEach((td, j) => {
			const cellId = uuidv4();
			let cellType = "";
			//Set header type based off of the first row's specified cell type
			if (i === 1) {
				cellType = td.textContent;
				headers[j].type = cellType;
				return;
			} else {
				cellType = findCellType(td.textContent, headers[j].type);
			}

			//Check if doesn't match header
			if (cellType !== headers[j].type) {
				cells.push(
					initialCell(
						cellId,
						rowId,
						j,
						CELL_TYPE.ERROR,
						td.textContent,
						headers[j].type
					)
				);
				return;
			}

			if (cellType === CELL_TYPE.TAG) {
				cells.push(initialCell(cellId, rowId, j, CELL_TYPE.TAG, ""));

				let content = td.textContent;
				content = stripLink(content);
				content = stripPound(content);

				//Check if tag already exists, otherwise create a new
				const tag = tags.find((tag) => tag.content === content);
				if (tag !== undefined) {
					const index = tags.indexOf(tag);
					tags[index].selected.push(cellId);
				} else {
					tags.push(
						initialTag(
							content,
							cellId,
							headers[j].id,
							randomColor()
						)
					);
				}
				//TODO handle multi-tag
			} else if (cellType === CELL_TYPE.MULTI_TAG) {
				cells.push(initialCell(cellId, rowId, j, CELL_TYPE.TAG, ""));
			} else if (cellType === CELL_TYPE.NUMBER) {
				cells.push(
					initialCell(
						cellId,
						rowId,
						j,
						CELL_TYPE.TEXT,
						td.textContent
					)
				);
			} else if (cellType === CELL_TYPE.TEXT) {
				let content = td.textContent;
				if (hasLink(td.textContent)) {
					content = stripLink(content);
					content = addBrackets(content);
				}
				cells.push(
					initialCell(cellId, rowId, j, CELL_TYPE.TEXT, content)
				);
			}
		});
	});
	return {
		headers,
		rows,
		cells,
		tags,
		updateTime: 0,
	};
};

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
): AppData | ErrorData => {
	//The el.textContent will return the textContent found in the default markdown table
	//rendered by Obsidian
	//It returns the text with no pipe symbols and no hyphens but includes whitespace
	const formatted = el.textContent.replace(/\s/g, "");
	const hash = crc32.str(formatted);

	//Check settings file for old data
	if (settings.appData[sourcePath]) {
		//Just in time garbage collection for old tables
		pruneAppData(app, settings, sourcePath);
		if (settings.appData[sourcePath][hash]) {
			return settings.appData[sourcePath][hash];
		}
	}

	let data: AppData | ErrorData = findErrorData(el);
	if (data === null) {
		data = findAppData(el, settings);
		//When we find the data, save it in the cache immediately
		//USE CASE:
		//if a user makes a table with tags but never edits it
		//they can open and close the app and the tags will change colors
		persistAppData(plugin, settings, data, sourcePath);
	}
	return data;
};

const pruneAppData = async (
	app: App,
	settings: NltSettings,
	sourcePath: string
) => {
	const file = app.vault.getAbstractFileByPath(sourcePath);
	if (file instanceof TFile) {
		const data = await app.vault.read(file);
		const tables = parseTables(data);

		const tableHashes: number[] = tables.map((table) => {
			return crc32.str(table);
		});

		const hashes: number[] = Object.keys(settings.appData[sourcePath]).map(
			(key) => parseInt(key)
		);
		//Iterate over each hash. If our table hashes don't include that hash
		//then delete it from the settings
		hashes.forEach((hash: number) => {
			if (!tableHashes.includes(hash))
				//Mark for deletion
				delete settings.appData[sourcePath][hash];
		});
	}
};

const parseTables = (input: string): string[] => {
	return input.match(/(\|.*\|\n){1,}/g).map((tableString) => {
		return formatTableStringForCRC(tableString);
	});
};

const formatTableStringForCRC = (input: string) => {
	return input
		.replace(/\s/g, "") //Replace all whitespace characters
		.replace(/[---]+\|/g, "") //Replace where at least 3 hyphens exist
		.replace(/\|/g, ""); //Replace pipes
};

const persistAppData = (
	plugin: NltPlugin,
	settings: NltSettings,
	appData: AppData,
	sourcePath: string
) => {
	//The table element will be different than that is returned originally from the markdown
	//processor. Therefore, we need to format it so that it will be the same. Otherwise the CRC32
	//values will not match
	const appDataString = appDataToString(appData);
	const formatted = formatTableStringForCRC(appDataString);
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

		console.log(content);
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

	//TODO add type definition row
	//If we have a table with the same header names, then we will overwrite it

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

export const findCellType = (textContent: string, expectedType: string) => {
	//If empty then just set it to the type it's supposed to be.
	//We do this to allow blank cells
	if (textContent === "") return expectedType;

	const numTags = countNumTags(textContent);
	if (numTags === 1) {
		//If we have a tag like "#test test" the first will match, but it's technically invalid
		if (textContent.match(/\s/)) {
			return CELL_TYPE.ERROR;
		} else {
			return CELL_TYPE.TAG;
		}
	} else if (numTags > 1) {
		return CELL_TYPE.MULTI_TAG;
	} else {
		if (textContent.match(/^\d+$/)) {
			if (expectedType === CELL_TYPE.TEXT) return CELL_TYPE.TEXT;
			else return CELL_TYPE.NUMBER;
		} else {
			return CELL_TYPE.TEXT;
		}
	}
};

/**
 * Counts the number of tags in a string.
 * A tag in this case is a value with a pound sign and text.
 * e.g #test
 * @param input The input string
 * @returns The number of tags in the input string
 */
export const countNumTags = (input: string): number => {
	return (input.match(/#[a-zA-z0-9-_]+/g) || []).length;
};

/**
 * Checks to see if input string contains hyperlinks (<a>)
 * @param input The input string
 * @returns Has hyperlinks or not
 */
export const hasLink = (input: string): boolean => {
	if (input.match(/^<a.*?>.*?<\/a>$/)) return true;
	return false;
};

/**
 * Checks to see if input string starts and ends with double square brackets
 * @param input The input string
 * @returns Has square brackets or not
 */
export const hasSquareBrackets = (input: string): boolean => {
	if (input.match(/(^\[\[)(.*)(]]$)/)) return true;
	return false;
};

/**
 * Removes double square brackets from input string
 * @param input The input string
 * @returns A string without double square brackets ([[ ]])
 */
export const stripSquareBrackets = (input: string): string => {
	input = input.replace(/^\[\[/, "");
	input = input.replace(/]]$/, "");
	return input;
};

/**
 * Removes all hyperlinks from input string
 * @param input The input string
 * @returns A string with no hyperlinks (<a>)
 */
export const stripLink = (input: string): string => {
	input = input.replace(/^<a.*?>/, "");
	input = input.replace(/<\/a>$/, "");
	return input;
};

/**
 * Removes pound sign from input string
 * @param input The input string
 * @returns A string with no pound (#) symbol
 */
export const stripPound = (input: string) => {
	return input.replace("#", "");
};

/**
 * Add a pounds sign to input string
 * @param input The input string
 * @returns A string starting with a pound (#) symbol
 */
export const addPound = (input: string) => {
	return `#${input}`;
};

/**
 * Adds double square brackets to input string
 * @param input The input string
 * @returns A string surrounded by double square brackets ([[ ]])
 */
export const addBrackets = (input: string): string => {
	return `[[${input}]]`;
};

/**
 * Converts file name to an Obsidian file hyperlink
 * @param fileName The file name without double square brackets
 * @returns A hyperlink (<a>) link for an Obsidian file
 */
export const toFileLink = (fileName: string): string => {
	return `<a data-href="${fileName}" href="${fileName}" class="internal-link" target="_blank" rel="noopener">${fileName}</a>`;
};

/**
 * Converts tag name to an Obsidian tag hyperlink
 * @param tagName The tagName
 * @returns A hyperlink (<a>) for an Obsidian tag
 */
export const toTagLink = (tagName: string): string => {
	return `<a href="#${tagName}" class="tag" target="_blank" rel="noopener">${tagName}</a>`;
};
