import { AppData } from "../state/appData";
import { Header, initialHeader } from "../state/header";
import { Row, initialRow } from "../state/row";
import {
	Cell,
	ErrorCell,
	NumberCell,
	TagCell,
	TextCell,
	DateCell,
	CheckBoxCell,
} from "../state/cell";

import { isCheckBoxChecked } from "../../string/validators";
import { Tag, initialTag } from "../state/tag";
import { findCellType, findInitialCellType } from "../../string/matchers";
import { AMPERSAND, BREAK_LINE_TAG, CELL_TYPE } from "src/app/constants";
import { randomColor, getCurrentTimeWithOffset } from "../../random";
import {
	AMPERSAND_CHARACTER_REGEX,
	LINE_BREAK_CHARACTER_REGEX,
} from "../../string/regex";
import {
	parseBoldTags,
	parseHighlightTags,
	parseItalicTags,
	parseUnderlineTags,
} from "../../string/parsers";

import { v4 as uuid } from "uuid";

const HEADER_ROW_INDEX = 0;
export const findAppData = (parsedTable: string[][]): AppData => {
	const headers: Header[] = [];
	const rows: Row[] = [];
	const cells: Cell[] = [];
	const tags: Tag[] = [];

	parsedTable.forEach((parsedRow, i) => {
		if (i === HEADER_ROW_INDEX) {
			parsedRow.forEach((th) => {
				headers.push(initialHeader(uuid(), th));
			});
		} else {
			const row = initialRow(uuid(), getCurrentTimeWithOffset());

			//Set column cell types from first row
			if (i == 0) {
				parsedRow.forEach((td, j) => {
					const cellType = findInitialCellType(td);
					headers[j].type = cellType;
				});
			}

			parsedRow.forEach((td, j) => {
				const cellType = findCellType(td, headers[j].type);
				const cellId = uuid();

				//Check if doesn't match header
				if (cellType !== headers[j].type) {
					cells.push(
						new ErrorCell(
							cellId,
							row.id,
							headers[j].id,
							headers[j].type,
							td
						)
					);
					return;
				}

				if (cellType === CELL_TYPE.TEXT) {
					let content = td;
					content = content.replace(
						LINE_BREAK_CHARACTER_REGEX("g"),
						BREAK_LINE_TAG
					);
					content = content.replace(
						AMPERSAND_CHARACTER_REGEX("g"),
						AMPERSAND
					);

					content = parseBoldTags(content);
					content = parseItalicTags(content);
					content = parseHighlightTags(content);
					content = parseUnderlineTags(content);

					cells.push(
						new TextCell(cellId, row.id, headers[j].id, content)
					);
				} else if (cellType === CELL_TYPE.NUMBER) {
					const number = td === "" ? -1 : parseInt(td);
					cells.push(
						new NumberCell(cellId, row.id, headers[j].id, number)
					);
				} else if (cellType === CELL_TYPE.DATE) {
					const date = td === "" ? null : new Date(td);
					cells.push(
						new DateCell(cellId, row.id, headers[j].id, date)
					);
				} else if (cellType === CELL_TYPE.CHECKBOX) {
					const isChecked = isCheckBoxChecked(td);
					cells.push(
						new CheckBoxCell(
							cellId,
							row.id,
							headers[j].id,
							isChecked
						)
					);
				} else if (cellType === CELL_TYPE.TAG) {
					cells.push(new TagCell(cellId, row.id, headers[j].id));

					if (td !== "") {
						const content = td;

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
					}
				}
			});

			rows.push(row);
		}
	});

	return {
		headers,
		rows,
		cells,
		tags,
	};
};

/**
 * Converts app data to a valid Obsidian markdown string
 * @param data The app data
 * @returns An Obsidian markdown string
 */
export const appDataToMarkdown = (data: AppData): string => {
	const columnCharLengths = calcColumnCharLengths(data);
	const buffer = new AppDataStringBuffer();
	buffer.createRow();

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.content, columnCharLengths[i]);
	});

	buffer.createRow();

	for (let i = 0; i < data.headers.length; i++) {
		const content = Array(columnCharLengths[i]).fill("-").join("");
		buffer.writeColumn(content, columnCharLengths[i]);
	}

	data.rows.forEach((row) => {
		buffer.createRow();

		for (let i = 0; i < data.headers.length; i++) {
			const cell = data.cells.find(
				(cell) =>
					cell.rowId === row.id &&
					cell.headerId === data.headers[i].id
			);
			if (cell.type === CELL_TYPE.TAG) {
				const tags = data.tags.filter((tag) =>
					tag.selected.includes(cell.id)
				);

				let content = "";

				tags.forEach((tag, j) => {
					if (tag.content === "") return;
					if (j === 0) content += tag.content;
					else content += " " + tag.content;
				});
				buffer.writeColumn(content, columnCharLengths[i]);
			} else {
				buffer.writeColumn(cell.toString(), columnCharLengths[i]);
			}
		}
	});
	return buffer.toString();
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
	regex[0] = findHeaderRow(headers);
	regex[1] = findHyphenRow(headers.length);

	//All the rows
	for (let i = 0; i < rows.length; i++) {
		regex[i + 2] = findRow(headers.length);
	}

	const expression = new RegExp(regex.join("\n"));
	return expression;
};

const findHeaderRow = (headers: Header[]) => {
	let regex = "\\|";
	headers.forEach((header) => {
		regex += `[ \\t]{0,}${header.content}[ \\t]{0,}\\|`;
	});
	return regex;
};

const findHyphenRow = (numColumns: number): string => {
	let regex = "\\|";
	for (let i = 0; i < numColumns; i++)
		regex += "[ \\t]{0,}[-]{3,}[ \\t]{0,}\\|";
	return regex;
};

const findRow = (numColumns: number): string => {
	let regex = "\\|";
	for (let i = 0; i < numColumns; i++) regex += ".*\\|";
	return regex;
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
export const calcColumnCharLengths = (data: AppData): ColumnCharLengths => {
	const columnCharLengths: { [columnPosition: number]: number } = [];

	//Check headers
	data.headers.forEach((header, i) => {
		columnCharLengths[i] = header.content.length;
	});

	//Check cells
	data.cells.forEach((cell: Cell) => {
		//We have to do this for the .length function to be available
		if (cell instanceof Cell) {
			const index = data.headers.findIndex(
				(header) => header.id === cell.headerId
			);
			if (cell.type === CELL_TYPE.TAG) {
				const arr = data.tags.filter((tag) =>
					tag.selected.includes(cell.id)
				);

				let content = "";
				arr.forEach((tag, i) => {
					if (tag.content !== "") {
						if (i === 0) content += tag.content;
						else content += " " + tag.content;
					}
				});
				if (columnCharLengths[index] < content.length)
					columnCharLengths[index] = content.length;
			} else {
				if (columnCharLengths[index] < cell.length())
					columnCharLengths[index] = cell.length();
			}
		}
	});
	return columnCharLengths;
};
