import { AppData } from "../state/appData";
import { Header, initialHeader } from "../state/header";
import { Row, initialRow } from "../state/row";
import { Cell, initialCell } from "../state/cell";
import { Tag, initialTag } from "../state/tag";
import { findCellType } from "../../string/matchers";
import { stripPound } from "../../string/strippers";
import { addPound } from "../../string/adders";
import { CELL_TYPE } from "src/app/constants";
import {
	randomColor,
	getCurrentTimeWithOffset,
	randomCellId,
} from "../../random";
import { TABLE_ID_REGEX } from "../../string/regex";

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
				if (j !== 0) headers.push(initialHeader("", th));
			});
		} else if (i === TYPE_DEFINITION_ROW) {
			parsedRow.forEach((td, j) => {
				if (j !== 0) headers[j - 1].type = td;
			});
		} else if (i === COLUMN_ID_ROW) {
			parsedRow.forEach((td, j) => {
				if (j !== 0) headers[j - 1].id = td;
			});
		} else {
			const row = initialRow("", getCurrentTimeWithOffset());

			parsedRow.forEach((td, j) => {
				if (j === 0) {
					row.id = td;
				} else {
					const cellId = randomCellId();
					const cellType = findCellType(td, headers[j - 1].type);

					//Check if doesn't match header
					if (cellType !== headers[j - 1].type) {
						cells.push(
							initialCell(
								cellId,
								row.id,
								headers[j - 1].id,
								CELL_TYPE.ERROR,
								td,
								headers[j - 1].type
							)
						);
						return;
					}

					if (cellType === CELL_TYPE.TAG) {
						cells.push(
							initialCell(
								cellId,
								row.id,
								headers[j - 1].id,
								CELL_TYPE.TAG,
								""
							)
						);

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
										headers[j - 1].id,
										cellId,
										content,
										randomColor()
									)
								);
							}
						}
					} else if (cellType === CELL_TYPE.NUMBER) {
						cells.push(
							initialCell(
								cellId,
								row.id,
								headers[j - 1].id,
								CELL_TYPE.NUMBER,
								td
							)
						);
					} else if (cellType === CELL_TYPE.TEXT) {
						cells.push(
							initialCell(
								cellId,
								row.id,
								headers[j - 1].id,
								CELL_TYPE.TEXT,
								td
							)
						);
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

	buffer.writeColumn("", columnCharLengths[0]);
	data.headers.forEach((header, i) =>
		buffer.writeColumn(header.content, columnCharLengths[i + 1])
	);

	buffer.createRow();

	for (let i = 0; i < data.headers.length + 1; i++) {
		const content = Array(columnCharLengths[i]).fill("-").join("");
		buffer.writeColumn(content, columnCharLengths[i]);
	}

	buffer.createRow();

	buffer.writeColumn("", columnCharLengths[0]);

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.type, columnCharLengths[i + 1]);
	});

	buffer.createRow();

	buffer.writeColumn(tableId, columnCharLengths[0]);
	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.id, columnCharLengths[i + 1]);
	});

	data.rows.forEach((row) => {
		buffer.createRow();

		buffer.writeColumn(row.id, columnCharLengths[0]);

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
				buffer.writeColumn(content, columnCharLengths[i + 1]);
			} else {
				buffer.writeColumn(cell.content, columnCharLengths[i + 1]);
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
	numHeaders: number,
	numRows: number
): RegExp => {
	const regex: string[] = [];
	regex[0] = "\\|.*\\|"; //Header row
	regex[1] = "\\|.*\\|"; //Hyphen row
	regex[2] = "\\|.*\\|"; //Type definition row
	regex[3] = `\\|[\\t ]+${tableId}[\\t ]+\\|`; //Table id row

	for (let i = 0; i < numHeaders; i++) regex[3] += ".*\\|";

	//Type definition row and all other rows
	for (let i = 4; i < numRows + 4; i++) regex[i] = "\\|.*\\|";

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
	data: AppData
): ColumnCharLengths => {
	const columnCharLengths: { [columnPosition: number]: number } = [];

	//Get first row
	columnCharLengths[0] = tableId.length;

	data.rows.forEach((row) => {
		if (columnCharLengths[0] < row.id.length)
			columnCharLengths[0] = row.id.length;
	});

	//Check headers
	data.headers.forEach((header, i) => {
		columnCharLengths[i + 1] = header.content.length;

		if (columnCharLengths[i + 1] < header.type.length)
			columnCharLengths[i + 1] = header.type.length;

		if (columnCharLengths[i + 1] < header.id.length)
			columnCharLengths[i + 1] = header.id.length;
	});

	//Check cells
	data.cells.forEach((cell) => {
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
			if (columnCharLengths[index + 1] < content.length)
				columnCharLengths[index + 1] = content.length;
		} else {
			if (columnCharLengths[index + 1] < cell.content.length)
				columnCharLengths[index + 1] = cell.content.length;
		}
	});
	return columnCharLengths;
};

export const findTableId = (parsedTable: string[][]): string | null => {
	const row = parsedTable[2];
	if (row) {
		const cell = row[0];
		if (!cell.match(TABLE_ID_REGEX)) return null;
		return cell;
	} else {
		return null;
	}
};
