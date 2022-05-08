import { v4 as uuidv4 } from "uuid";

import { AppData } from "../state/appData";
import { Header, initialHeader } from "../state/header";
import { Row, initialRow } from "../state/row";
import { Cell, initialCell } from "../state/cell";
import { Tag, initialTag } from "../state/tag";
import { findCellType } from "../../string/matchers";
import { stripPound } from "../../string/strippers";
import { addPound } from "../../string/adders";
import { CELL_TYPE } from "src/app/constants";
import { randomColor, getCurrentTimeWithOffset } from "../../random";

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
