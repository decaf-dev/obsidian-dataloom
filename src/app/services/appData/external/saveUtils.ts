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
import { findCellType } from "../../string/matchers";
import { stripPound } from "../../string/strippers";
import { addPound } from "../../string/adders";
import { BREAK_LINE_TAG, CELL_TYPE } from "src/app/constants";
import {
	randomColor,
	getCurrentTimeWithOffset,
	randomCellId,
} from "../../random";
import { LINE_BREAK_REGEX, TABLE_ID_REGEX } from "../../string/regex";

export const findAppData = (parsedTable: string[][]): AppData => {
	const HEADER_ROW = 0;
	const TYPE_DEFINITION_ROW = 1;
	const COLUMN_ID_ROW = 2;

	const headers: Header[] = [];
	const rows: Row[] = [];
	const cells: Cell[] = [];
	const tags: Tag[] = [];

	parsedTable.forEach((parsedRow, i) => {
		if (i === HEADER_ROW) {
			parsedRow.forEach((th, j) => {
				if (j !== parsedRow.length - 1)
					headers.push(initialHeader("", th));
			});
		} else if (i === TYPE_DEFINITION_ROW) {
			parsedRow.forEach((td, j) => {
				if (j !== parsedRow.length - 1) headers[j].type = td;
			});
		} else if (i === COLUMN_ID_ROW) {
			parsedRow.forEach((td, j) => {
				if (j !== parsedRow.length - 1) headers[j].id = td;
			});
		} else {
			const row = initialRow(
				parsedRow[parsedRow.length - 1],
				getCurrentTimeWithOffset()
			);

			parsedRow.forEach((td, j) => {
				if (j !== parsedRow.length - 1) {
					const cellId = randomCellId();
					const cellType = findCellType(td, headers[j].type);

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
							LINE_BREAK_REGEX("g"),
							BREAK_LINE_TAG
						);
						cells.push(
							new TextCell(cellId, row.id, headers[j].id, content)
						);
					} else if (cellType === CELL_TYPE.NUMBER) {
						const number = td === "" ? -1 : parseInt(td);
						cells.push(
							new NumberCell(
								cellId,
								row.id,
								headers[j].id,
								number
							)
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
							const content = stripPound(td);

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
		updateTime: 0,
	};
};

/**
 * Converts app data to a valid Obsidian markdown string
 * @param data The app data
 * @returns An Obsidian markdown string
 */
export const appDataToMarkdown = (tableId: string, data: AppData): string => {
	const columnCharLengths = calcColumnCharLengths(tableId, data);

	const buffer = new AppDataStringBuffer();
	buffer.createRow();

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.content, columnCharLengths[i]);
	});
	buffer.writeColumn("", columnCharLengths[data.headers.length]);

	buffer.createRow();

	for (let i = 0; i < data.headers.length + 1; i++) {
		const content = Array(columnCharLengths[i]).fill("-").join("");
		buffer.writeColumn(content, columnCharLengths[i]);
	}

	buffer.createRow();

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.type, columnCharLengths[i]);
	});

	buffer.writeColumn("", columnCharLengths[data.headers.length]);

	buffer.createRow();

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.id, columnCharLengths[i]);
	});

	buffer.writeColumn(tableId, columnCharLengths[data.headers.length]);

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
					if (j === 0) content += addPound(tag.content);
					else content += " " + addPound(tag.content);
				});
				buffer.writeColumn(content, columnCharLengths[i]);
			} else {
				buffer.writeColumn(cell.toString(), columnCharLengths[i]);
			}
		}

		buffer.writeColumn(row.id, columnCharLengths[data.headers.length]);
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
export const findTableRegex = (
	tableId: string,
	headers: Header[],
	rows: Row[]
): RegExp => {
	const regex: string[] = [];
	regex[0] = findHeaderRow(headers);
	regex[1] = findHyphenRow(headers.length);
	regex[2] = findTypeDefinitionRow(headers);
	regex[3] = findColumnRow(tableId, headers);

	//All the rows
	for (let i = 0; i < rows.length; i++) {
		regex[i + 4] = findRegexRow(headers.length);
	}

	const expression = new RegExp(regex.join("\n"));
	return expression;
};

const findHeaderRow = (headers: Header[]) => {
	let regex = "\\|";
	headers.forEach((header) => {
		regex += `[ \\t]{0,}${header.content}[ \\t]{0,}\\|`;
	});
	regex += ".*\\|[ ]*";
	return regex;
};

const findHyphenRow = (numColumns: number): string => {
	let regex = "\\|";
	for (let i = 0; i < numColumns + 1; i++)
		regex += "[ \\t]{0,}[-]{3,}[ \\t]{0,}\\|";
	regex += "[ ]*";
	return regex;
};

const findTypeDefinitionRow = (headers: Header[]): string => {
	let regex = "\\|";
	for (let i = 0; i < headers.length; i++)
		regex += `[ \\t]{0,}${headers[i].type}[ \\t]{0,}\\|`;
	regex += ".*\\|[ ]*";
	return regex;
};

const findColumnRow = (tableId: string, headers: Header[]): string => {
	let regex = "\\|";
	for (let i = 0; i < headers.length; i++)
		regex += `[ \\t]{0,}${headers[i].id}[ \\t]{0,}\\|`;
	regex += `[ \\t]{0,}${tableId}[ \\t]{0,}\\|[ ]*`;
	return regex;
};

const findRegexRow = (numColumns: number): string => {
	let regex = "\\|.*\\|";
	for (let i = 0; i < numColumns; i++) regex += ".*\\|";
	regex += "[ ]*"; //Allow white space at the end of each row
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
export const calcColumnCharLengths = (
	tableId: string,
	data: AppData
): ColumnCharLengths => {
	const columnCharLengths: { [columnPosition: number]: number } = [];

	data.rows.forEach((row) => {
		if (columnCharLengths[0] < row.id.length)
			columnCharLengths[0] = row.id.length;
	});

	//Check headers
	data.headers.forEach((header, i) => {
		columnCharLengths[i] = header.content.length;

		if (columnCharLengths[i] < header.type.length)
			columnCharLengths[i] = header.type.length;

		if (columnCharLengths[i] < header.id.length)
			columnCharLengths[i] = header.id.length;
	});

	//Get first row
	columnCharLengths[data.headers.length] = tableId.length;

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
						if (i === 0) content += addPound(tag.content);
						else content += " " + addPound(tag.content);
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

export const findTableId = (parsedTable: string[][]): string | null => {
	const row = parsedTable[2];
	if (row) {
		const cell = row[row.length - 1];
		if (!cell.match(TABLE_ID_REGEX)) return null;
		return cell;
	} else {
		return null;
	}
};
