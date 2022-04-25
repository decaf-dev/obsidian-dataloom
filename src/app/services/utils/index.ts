import { buffer } from "stream/consumers";
import { v4 as uuidv4 } from "uuid";

import { CELL_COLOR, CELL_TYPE } from "../../constants";
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
import { AppData } from "../../services/state";

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(CELL_COLOR).length);
	return Object.values(CELL_COLOR)[index];
};

export const randomTableId = (): string => {
	return Math.random().toString(36).replace("0.", "").substring(0, 6);
};

/**
 * Creates a 1 column NLT markdown table
 * @returns An NLT markdown table
 */
export const createEmptyTable = (uuid: string): string => {
	const rows = [];
	rows[0] = "| Column 1 |";
	rows[1] = "| -------- |";
	rows[2] = `| ${uuid} |`;
	rows[3] = "| text |";
	return rows.join("\n");
};

/**
 * Finds a regex that will match a table based on header content, type definition row,
 * and number of cells
 * @param headers The headers
 * @param rows The rows
 * @returns A regex that matches this table
 */
export const findTableRegex = (
	tableId: string,
	headers: Header[],
	rows: Row[]
): RegExp => {
	const regex: string[] = [];
	regex[0] = "\\|.*\\|"; //Header row
	regex[1] = "\\|.*\\|"; //Hyphen row
	regex[2] = `\\|[\\t ]+${tableId}[\\t ]+\\|`; //Table id row

	for (let i = 1; i < headers.length; i++) regex[2] += ".*\\|";

	//Type definition row and all other rows
	for (let i = 3; i < rows.length + 4; i++) regex[i] = "\\|.*\\|";

	const expression = new RegExp(regex.join("\n"));
	return expression;
};

/**
 * Converts app data to a valid Obsidian markdown string
 * @param data The app data
 * @returns An Obsidian markdown string
 */
export const appDataToMarkdown = (tableId: string, data: AppData): string => {
	const columnCharLengths = calcColumnCharLengths(
		tableId,
		data.headers,
		data.cells,
		data.tags
	);

	const buffer = new AppDataStringBuffer();
	buffer.createRow();

	data.headers.forEach((header, i) =>
		buffer.writeColumn(header.content, columnCharLengths[i])
	);

	buffer.createRow();

	data.headers.forEach((_header, i) => {
		const content = Array(columnCharLengths[i]).fill("-").join("");
		buffer.writeColumn(content, columnCharLengths[i]);
	});

	buffer.createRow();

	data.headers.forEach((_header, i) => {
		buffer.writeColumn(i === 0 ? tableId : "", columnCharLengths[i]);
	});

	buffer.createRow();

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.type, columnCharLengths[i]);
	});

	data.rows.forEach((row) => {
		buffer.createRow();

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
				buffer.writeColumn(content, columnCharLengths[j]);
			} else {
				buffer.writeColumn(cell.content, columnCharLengths[j]);
			}
		});
	});
	return buffer.toString();
};

export class AppDataStringBuffer {
	string: string;

	constructor() {
		this.string = "";
	}

	createRow() {
		if (this.string !== "") this.string += "\n";
		this.string += "|";
	}

	writeColumn(content: string, columnCharLength: number) {
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
	[columnPosition: number]: number;
}

/**
 * Calculates the max char length for each column.
 * This is used to know how much padding to add to cell.
 * @param headers An array of headers
 * @param cells An array of cells
 * @param tags An array of tags
 * @returns An object containing the calculated lengths
 */
export const calcColumnCharLengths = (
	tableId: string,
	headers: Header[],
	cells: Cell[],
	tags: Tag[]
): ColumnCharLengths => {
	const columnCharLengths: { [columnPosition: number]: number } = [];

	//Check headers
	headers.forEach((header, i) => {
		columnCharLengths[i] = header.content.length;
	});

	//Check table id
	if (columnCharLengths[0] < tableId.length)
		columnCharLengths[0] = tableId.length;

	//Check types
	headers.forEach((header, i) => {
		if (columnCharLengths[i] < header.type.length)
			columnCharLengths[i] = header.type.length;
	});

	//Check cells
	cells.forEach((cell) => {
		if (cell.type === CELL_TYPE.TAG || cell.type === CELL_TYPE.MULTI_TAG) {
			const arr = tags.filter((tag) => tag.selected.includes(cell.id));

			let content = "";
			arr.forEach((tag, i) => {
				if (tag.content !== "") {
					if (i === 0) content += addPound(tag.content);
					else content += " " + addPound(tag.content);
				}
			});
			if (columnCharLengths[cell.headerIndex] < content.length)
				columnCharLengths[cell.headerIndex] = content.length;
		} else {
			if (columnCharLengths[cell.headerIndex] < cell.content.length)
				columnCharLengths[cell.headerIndex] = cell.content.length;
		}
	});
	return columnCharLengths;
};

export const mergeAppData = (
	oldAppData: AppData,
	newAppData: AppData
): AppData => {
	//Grab sort settings
	const merged = { ...newAppData };
	oldAppData.headers.forEach((headers, i) => {
		merged.headers[i].sortName = headers.sortName;
	});

	//Grab row settings
	oldAppData.rows.forEach((row, i) => {
		merged.rows[i].creationTime = row.creationTime;
	});

	//Grab tag settings
	oldAppData.tags.forEach((tag, i) => {
		const found = merged.tags.find((t) => t.content === tag.content);
		if (found) {
			const index = merged.tags.indexOf(found);
			merged.tags[index].color = tag.color;
		}
	});
	return merged;
};

const HEADER_ROW_INDEX = 0;
const TABLE_ID_ROW_INDEX = 1;
const TYPE_DEFINITION_ROW_INDEX = 2;

export const findAppData = (parsedTable: string[][]): AppData => {
	const headers: Header[] = [];
	const rows: Row[] = [];
	const cells: Cell[] = [];
	const tags: Tag[] = [];

	parsedTable.forEach((row, i) => {
		if (i === HEADER_ROW_INDEX) {
			row.forEach((th, j) => {
				headers.push(initialHeader(th, j));
			});
		} else if (i === TYPE_DEFINITION_ROW_INDEX) {
			row.forEach((td, j) => {
				//Set header type based off of the first row's specified cell type
				headers[j].type = td;
			});
		} else if (i !== TABLE_ID_ROW_INDEX) {
			const rowId = uuidv4();
			//Since these operations are preformed very quickly, it's possible
			//for our to get the same time
			//Add a timeoffset to make sure the time is different
			const time = Date.now() + i;
			rows.push(initialRow(rowId, time));

			row.forEach((td, j) => {
				const cellId = uuidv4();
				let cellType = "";
				//Set header type based off of the first row's specified cell type
				if (i === 1) {
					cellType = td;
					headers[j].type = cellType;
					return;
				} else {
					cellType = findCellType(td, headers[j].type);
				}

				//Check if doesn't match header
				if (cellType !== headers[j].type) {
					cells.push(
						initialCell(
							cellId,
							rowId,
							j,
							CELL_TYPE.ERROR,
							td,
							headers[j].type
						)
					);
					return;
				}

				if (cellType === CELL_TYPE.TAG) {
					cells.push(
						initialCell(cellId, rowId, j, CELL_TYPE.TAG, "")
					);

					let content = td;
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
								headers[j].index,
								cellId,
								content,
								randomColor()
							)
						);
					}
				} else if (cellType === CELL_TYPE.NUMBER) {
					cells.push(
						initialCell(cellId, rowId, j, CELL_TYPE.TEXT, td)
					);
				} else if (cellType === CELL_TYPE.TEXT) {
					let content = td;
					content = stripLinks(content, true);
					cells.push(
						initialCell(cellId, rowId, j, CELL_TYPE.TEXT, content)
					);
				}
			});
		}
	});

	return {
		headers,
		rows,
		cells,
		tags,
		updateTime: 0,
	};
};

export const findTableId = (parsedTable: string[][]): string | null => {
	if (parsedTable.length < 2) return null;
	const row = parsedTable[1];
	const id = row[0];

	//If there is no table id row
	if (!Object.values(CELL_TYPE).every((type) => type !== id)) return null;
	//If the table id row is there but omitted
	if (id == "") return null;
	return id;
};

export const validTypeDefinitionRow = (parsedTable: string[][]): boolean => {
	if (parsedTable.length < 3) return false;
	const row = parsedTable[2];

	let valid = true;

	for (let i = 0; i < row.length; i++) {
		const cell = row[i];
		const didntMatch = Object.values(CELL_TYPE).every(
			(type) => type !== cell
		);
		if (didntMatch) valid = false;
	}
	return valid;
};

export const findCellType = (textContent: string, expectedType: string) => {
	//If empty then just set it to the type it's supposed to be.
	//We do this to allow blank cells
	if (textContent === "") return expectedType;

	let cellType = CELL_TYPE.ERROR;

	const numTags = countNumTags(textContent);
	if (numTags === 1) {
		//Don't allow spaces in tags
		if (!textContent.match(/\s/)) cellType = CELL_TYPE.TAG;
	} else if (numTags > 1) {
		return CELL_TYPE.MULTI_TAG;
	} else if (textContent.match(/^\d+$/)) {
		if (expectedType === CELL_TYPE.TEXT) cellType = CELL_TYPE.TEXT;
		else cellType = CELL_TYPE.NUMBER;
	} else {
		cellType = CELL_TYPE.TEXT;
	}

	if (cellType !== expectedType) return CELL_TYPE.ERROR;
	return cellType;
};

export const findMarkdownTablesFromFileData = (data: string): string[] => {
	//We match groups of lines that follow the markdown table syntax
	// | line 1  |
	// | line 2  |
	const matches = data.match(/(\|.*\|(\r\n|\r|\n){0,1}){1,}/g) || [];
	//From there we check if this is actually a table
	//We will just look for the hyphen row with each cell having at least 3 hyphens
	return matches.filter((match) => isMarkdownTable(match));
};

export const isMarkdownTable = (data: string): boolean => {
	const rows = data.match(markdownRowsRegex);

	if (rows && rows.length >= 2) {
		const headerRow = rows[0];
		const headerCells = headerRow.match(markdownCellsRegex);
		const hyphenRow = rows[1];
		const hyphenCells = hyphenRow.match(markdownCellsRegex);

		if (hyphenCells.length < headerCells.length) return false;

		for (let j = 0; j < hyphenCells.length; j++) {
			const cell = hyphenCells[j];
			if (!cell.match(markdownHyphenCellRegex)) return false;
		}
		return true;
	}
	return false;
};

/**
 * Parses data for an individual table.
 * This is not used for all file data. It is intended to be used
 * on one table returned from findMarkdownTablesFromFileData
 *
 * We assume that this is a valid markdown table
 * @param data The data for one table. No more, no less.
 * @returns A parsed table representation
 */
export const parseTableFromMarkdown = (data: string): string[][] => {
	//Start by breaking up everything into rows based off of a row syntax | ---- |
	const rows = data.match(markdownRowsRegex);

	const table = [];
	//For each row, parse each cell
	for (let i = 0; i < rows.length; i++) {
		let cells = rows[i].match(markdownCellsRegex);
		cells = cells.map((cell) => cell.replace(/\|/g, "").trim());
		cells = cells.filter(
			(cell) => (cell.match("-{3,}") || []).length === 0
		);

		if (cells.length !== 0) table.push(cells);
	}
	return table;
};

export const parseTableFromEl = (el: HTMLElement) => {
	const table = [];
	const tr = el.getElementsByTagName("tr");
	const th = tr[0].getElementsByTagName("th");

	let row = [];
	for (let i = 0; i < th.length; i++) row.push(th[i].textContent);
	table.push(row);

	for (let i = 1; i < tr.length; i++) {
		const td = tr[i].getElementsByTagName("td");
		row = [];
		for (let j = 0; j < td.length; j++) row.push(td[j].textContent);
		table.push(row);
	}
	return table;
};

/**
 * Matches an individual markdown hyphen cell
 * e.g. "\t ---\t|"
 * Will match spaces, tabs, and ending pipe symbol
 * We don't match the first pipe symbol because not every cell in a row will
 * have 2 pipes
 */
export const markdownHyphenCellRegex = new RegExp(
	/[ \t]{0,}[-]{3,}[ \t]{0,}\|/
);

/**
 * Matches an individual markdown cell
 * e.g. "\t thisismycell\t|""
 * Will match spaces, tabs, and ending pipe symbol
 *
 * We don't match the first pipe symbol because not every cell in a row will
 * have 2 pipes
 * @returns An array of matches
 */
export const markdownCellsRegex = new RegExp(/[ \t]{0,}[^|\r\n]+[ \t]{0,}\|/g);

/**
 * Matches an individual markdown row
 * @returns An array of matches
 */
export const markdownRowsRegex = new RegExp(/(\|[ ]{0,}.*[ ]{0,}\|){1,}/g);

/**
 * Counts the number of tags in a string.
 * @param input The input string
 * @returns The number of tags in the input string
 */
export const countNumTags = (input: string): number => {
	return (input.match(/#[^ \t]+/g) || []).length;
};

export const parseFileLinks = (input: string): string => {
	//Check if it has has urls
	const matches = input.match(/\[\[[^\s]+]]/g) || [];
	matches.forEach((match) => {
		const replacement = toFileLink(stripSquareBrackets(match));
		input = input.replace(match, replacement);
	});
	return input;
};

export const parseURLs = (input: string): string => {
	//Check if it has has urls
	const matches = input.match(/https{0,1}:\/\/[^\s]*/g) || [];
	matches.forEach((match) => {
		const replacement = toExternalLink(match);
		input = input.replace(match, replacement);
	});
	return input;
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
 * Checks to see if input string starts and ends with double square brackets
 * @param input The input string
 * @returns Has square brackets or not
 */
export const hasSquareBrackets = (input: string): boolean => {
	if (input.match(/(^\[\[)(.*)(]]$)/)) return true;
	return false;
};

/**
 * Removes all hyperlinks from input string
 * @param input The input string
 * @returns A string with no hyperlinks (<a>)
 */
export const stripLinks = (
	input: string,
	replaceWithSquareBrackets = false
): string => {
	const matches = input.match(/<a.*?>.*?<\/a>/g) || [];
	matches.forEach((match) => {
		input = input.replace(
			match,
			stripLink(match, replaceWithSquareBrackets)
		);
	});
	return input;
};

export const stripLink = (input: string, replaceWithSquareBrackets = false) => {
	return input
		.replace(/<a.*?>/, replaceWithSquareBrackets ? "[[" : "")
		.replace(/<\/a>/, replaceWithSquareBrackets ? "]]" : "");
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
 * Converts file name to an external hyperlink
 * @param url The url
 * @returns A hyperlink (<a>) link for an Obsidian file
 */
export const toExternalLink = (url: string): string => {
	return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
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
	if (tagName.startsWith("#")) throw "tagName cannot start with pound symbol";
	return `<a href="#${tagName}" class="tag" target="_blank" rel="noopener">${tagName}</a>`;
};
