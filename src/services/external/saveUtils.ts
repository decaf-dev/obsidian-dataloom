import { TableModel, Cell } from "../table/types";
import { findRowCells, getColumnIndex } from "../table/utils";

/**
 * Converts table model to markdown
 */
export const tableModelToMarkdown = (
	model: TableModel,
	tableId: string
): string => {
	const { numColumns, cells } = model;
	const columnCharLengths = calcColumnCharLengths(cells, numColumns);
	const buffer = new TableModelStringBuffer();
	buffer.createRow();

	for (let i = 0; i < numColumns; i++) {
		buffer.writeCell(cells[i].content, columnCharLengths[i]);
	}

	buffer.createRow();

	for (let i = 0; i < numColumns; i++) {
		let numChars = columnCharLengths[i] > 3 ? columnCharLengths[i] : 3;
		const content = Array(numChars).fill("-").join("");
		buffer.writeCell(content, numChars);
	}

	buffer.createRow();

	const numRows = cells.length / numColumns;
	console.log(numRows);
	//Ignore header row
	for (let i = 1; i < numRows; i++) {
		const rowCells = findRowCells(i, cells, numColumns);
		for (let j = 0; j < rowCells.length; j++) {
			const columnIndex = getColumnIndex(i, numColumns);
			const cell = rowCells[j];
			buffer.writeCell(cell.content, columnCharLengths[columnIndex]);
		}
		buffer.createRow();
	}

	for (let i = 0; i < numColumns; i++) {
		if (i === 0) {
			buffer.writeCell(tableId, columnCharLengths[i]);
		} else {
			buffer.writeCell("", columnCharLengths[i]);
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
	[columnPosition: number]: number;
}

/**
 * Calculates the max char length for each column.
 * This is used to know how much padding to add to cell.
 */
export const calcColumnCharLengths = (
	cells: Cell[],
	numColumns: number
): ColumnCharLengths => {
	const columnCharLengths: { [columnPosition: number]: number } = {};

	for (let i = 0; i < cells.length; i++) {
		const content = cells[i].content;
		const columnIndex = getColumnIndex(i, numColumns);
		if (
			!columnCharLengths[columnIndex] ||
			columnCharLengths[columnIndex] < content.length
		) {
			columnCharLengths[columnIndex] = content.length;
		}
	}
	return columnCharLengths;
};
