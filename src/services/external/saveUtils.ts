import { TableModel, Cell } from "../table/types";
import { findRowCells, getColumnIndex } from "../table/utils";

/**
 * Converts table model to markdown
 */
export const tableModelToMarkdown = (model: TableModel): string => {
	const { numColumns, cells } = model;
	const columnCharLengths = calcColumnCharLengths(cells, numColumns);
	const buffer = new TableModelStringBuffer();
	buffer.createRow();

	let index = 0;
	for (let i = 0; i < numColumns; i++) {
		buffer.writeCell(cells[i].content, columnCharLengths[i]);
	}

	buffer.createRow();
	index += numColumns;

	for (let i = index; i < index + numColumns; i++) {
		let content = "";
		for (let j = 0; j < columnCharLengths[i]; j++) content += "-";
		buffer.writeCell(content, columnCharLengths[i]);
	}

	index += numColumns;

	const numRows = cells.length / numColumns - 1;
	for (let i = 0; i < numRows; i++) {
		const rowCells = findRowCells(i, cells, numColumns);
		for (let j = 0; j < rowCells.length; j++) {
			const columnIndex = getColumnIndex(i, numColumns);
			const cell = rowCells[j];
			buffer.writeCell(cell.content, columnCharLengths[columnIndex]);
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
