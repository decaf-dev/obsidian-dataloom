import React from "react";

import { v4 as uuidv4 } from "uuid";

import { CELL_COLOR, CELL_TYPE } from "../../constants";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import EditIcon from "@mui/icons-material/Edit";

import {
	Header,
	Tag,
	Row,
	Cell,
	initialHeader,
	initialCell,
	initialRow,
	initialTag,
} from "../state";
import { AppData } from "../state";
import { ICON } from "../../constants";

export const findIcon = (icon: string, className: string): React.ReactNode => {
	switch (icon) {
		case ICON.KEYBOARD_ARROW_UP:
			return <KeyboardArrowUpIcon className={className} />;
		case ICON.KEYBOARD_ARROW_DOWN:
			return <KeyboardArrowDownIcon className={className} />;
		case ICON.KEYBOARD_DOUBLE_ARROW_UP:
			return <KeyboardDoubleArrowUpIcon className={className} />;
		case ICON.KEYBOARD_DOUBLE_ARROW_DOWN:
			return <KeyboardDoubleArrowDownIcon className={className} />;
		case ICON.KEYBOARD_ARROW_LEFT:
			return <KeyboardArrowLeftIcon className={className} />;
		case ICON.KEYBOARD_ARROW_RIGHT:
			return <KeyboardArrowRightIcon className={className} />;
		case ICON.KEYBOARD_DOUBLE_ARROW_LEFT:
			return <KeyboardDoubleArrowLeftIcon className={className} />;
		case ICON.KEYBOARD_DOUBLE_ARROW_RIGHT:
			return <KeyboardDoubleArrowRightIcon className={className} />;
		case ICON.DELETE:
			return <DeleteIcon className={className} />;
		case ICON.MORE_VERT:
			return <MoreVertIcon className={className} />;
		case ICON.SORT:
			return <SortIcon className={className} />;
		case ICON.KEYBOARD_BACKSPACE:
			return <KeyboardBackspaceIcon className={className} />;
		case ICON.MOVE_UP:
			return <MoveUpIcon className={className} />;
		case ICON.MOVE_DOWN:
			return <MoveDownIcon className={className} />;
		case ICON.TEXT_SNIPPET:
			return <TextSnippetIcon className={className} />;
		case ICON.EDIT:
			return <EditIcon className={className} />;
		default:
			return "";
	}
};

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(CELL_COLOR).length);
	return Object.values(CELL_COLOR)[index];
};

export const getCurrentTimeWithOffset = (): number => {
	//Since operations are preformed very quickly, it's possible
	//for our to get the same time
	//Add a timeoffset to make sure the time is different
	return Math.round(Date.now() - Math.random() * 1000);
};

export const randomTableId = (): string => {
	return Math.random().toString(36).replace("0.", "").substring(0, 6);
};

export const sanitizeHTML = (innerHTML: string) => {
	var temp = document.createElement("div");
	temp.textContent = innerHTML;
	return temp.innerHTML;
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

		for (let i = 0; i < data.headers.length; i++) {
			const cell = data.cells.find(
				(cell) =>
					cell.rowId === row.id &&
					cell.headerId === data.headers[i].id
			);
			if (
				cell.type === CELL_TYPE.TAG ||
				cell.type === CELL_TYPE.MULTI_TAG
			) {
				const tags = data.tags.filter((tag) =>
					tag.selected.includes(cell.id)
				);

				let content = "";

				tags.forEach((tag, j) => {
					if (tag.content === "") return;
					if (j === 0) content += addPound(tag.content);
					else content += " " + addPound(tag.content);
				});
				buffer.writeColumn(content, columnCharLengths[i]);
			} else {
				buffer.writeColumn(cell.content, columnCharLengths[i]);
			}
		}
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
		const index = headers.findIndex(
			(header) => header.id === cell.headerId
		);
		if (cell.type === CELL_TYPE.TAG || cell.type === CELL_TYPE.MULTI_TAG) {
			const arr = tags.filter((tag) => tag.selected.includes(cell.id));

			let content = "";
			arr.forEach((tag, i) => {
				if (tag.content !== "") {
					if (i === 0) content += addPound(tag.content);
					else content += " " + addPound(tag.content);
				}
			});
			if (columnCharLengths[index] < content.length)
				columnCharLengths[index] = content.length;
		} else {
			if (columnCharLengths[index] < cell.content.length)
				columnCharLengths[index] = cell.content.length;
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
	oldAppData.headers.forEach((header, i) => {
		merged.headers[i].sortName = header.sortName;
		merged.headers[i].width = header.width;
	});

	//TODO fix potential bugs with adding data
	oldAppData.cells.forEach((cell, i) => {
		merged.cells[i].id = cell.id;
	});

	console.log(oldAppData.cells.length);
	console.log(merged.cells.length);

	//TODO fix potential bugs with adding data
	//This allows the user to add new rows or delete existing rows
	//and still have the correct creationTime
	newAppData.rows.forEach((row, i) => {
		if (oldAppData.rows.length >= i + 1) {
			merged.rows[i].creationTime = oldAppData.rows[i].creationTime;
		} else {
			merged.rows[i].creationTime = row.creationTime;
		}
	});

	//Grab tag settings
	oldAppData.tags.forEach((tag, i) => {
		const index = merged.tags.findIndex((t) => t.content === tag.content);
		if (index !== -1) merged.tags[index].color = tag.color;
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
			row.forEach((th) => {
				headers.push(initialHeader(th));
			});
		} else if (i === TYPE_DEFINITION_ROW_INDEX) {
			row.forEach((td, j) => {
				//Set header type based off of the first row's specified cell type
				headers[j].type = td;
			});
		} else if (i !== TABLE_ID_ROW_INDEX) {
			const rowId = uuidv4();
			rows.push(initialRow(rowId, getCurrentTimeWithOffset()));

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
							headers[j].id,
							CELL_TYPE.ERROR,
							td,
							headers[j].type
						)
					);
					return;
				}

				if (cellType === CELL_TYPE.TAG) {
					cells.push(
						initialCell(
							cellId,
							rowId,
							headers[j].id,
							CELL_TYPE.TAG,
							""
						)
					);

					let content = stripPound(td);

					//Check if tag already exists, otherwise create a new
					const index = tags.findIndex(
						(tag) => tag.content === content
					);
					if (index !== -1) {
						tags[index].selected.push(cellId);
					} else {
						tags.push(
							initialTag(
								headers[j].id,
								cellId,
								content,
								randomColor()
							)
						);
					}
				} else if (cellType === CELL_TYPE.NUMBER) {
					cells.push(
						initialCell(
							cellId,
							rowId,
							headers[j].id,
							CELL_TYPE.NUMBER,
							td
						)
					);
				} else if (cellType === CELL_TYPE.TEXT) {
					cells.push(
						initialCell(
							cellId,
							rowId,
							headers[j].id,
							CELL_TYPE.TEXT,
							td
						)
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

	//Allow everything
	if (expectedType === CELL_TYPE.TEXT) {
		return CELL_TYPE.TEXT;
	} else if (expectedType === CELL_TYPE.NUMBER) {
		if (isNumber(textContent)) return CELL_TYPE.NUMBER;
	} else if (expectedType === CELL_TYPE.TAG) {
		if (isTag(textContent)) return CELL_TYPE.TAG;
	}
	return CELL_TYPE.ERROR;
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
		for (let j = 0; j < td.length; j++) {
			let sanitized = sanitizeHTML(td[j].innerHTML);
			sanitized = stripLinks(sanitized);
			row.push(sanitized);
		}
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

export const NUMBER_REGEX = new RegExp(/^\d+$/);

export const isNumber = (input: string) => {
	return input.match(NUMBER_REGEX) ? true : false;
};

export const TAG_REGEX = new RegExp(/^#.[^\s]+$/);

export const isTag = (input: string) => {
	return input.match(TAG_REGEX) ? true : false;
};

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
	const matches = input.match(/\[\[[^\n\r\]]+]]/g) || [];
	matches.forEach((match) => {
		const replacement = toFileLink(stripSquareBrackets(match));
		input = input.replace(match, replacement);
	});
	return input;
};

export const matchURLs = (input: string) => {
	return input.match(/https{0,1}:\/\/[^\s]*/g) || [];
};

export const parseURLs = (input: string): string => {
	//Check if it has has urls
	const matches = matchURLs(input);
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
export const stripLinks = (input: string): string => {
	const matches = input.match(/&lt;a.*?&gt;.*?&lt;\/a&gt;/g) || [];
	matches.forEach((match) => {
		input = input.replace(match, stripLink(match));
	});
	return input;
};

export const stripLink = (input: string) => {
	const replaceWithSquareBrackets =
		(input.match(/class=\"internal-link\"/) || []).length !== 0;
	return input
		.replace(/&lt;a.*?&gt;/, replaceWithSquareBrackets ? "[[" : "")
		.replace(/&lt;\/a&gt;/, replaceWithSquareBrackets ? "]]" : "");
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
	return `<a href="#${tagName}" class="tag" target="_blank" rel="noopener">#${tagName}</a>`;
};
