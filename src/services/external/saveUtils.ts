import { TableModel, Cell } from "../table/types";

/**
 * Converts table data to a valid Obsidian markdown string
 * @param data The app data
 * @returns An Obsidian markdown string
 */
export const tableModelToMarkdown = (data: TableModel): string => {
	const columnCharLengths = calcColumnCharLengths(data);
	const buffer = new TableModelStringBuffer();
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
			buffer.writeColumn(cell.content, columnCharLengths[i]);
		}
	});
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
export const calcColumnCharLengths = (data: TableModel): ColumnCharLengths => {
	const columnCharLengths: { [columnPosition: number]: number } = [];

	//Check headers
	data.headers.forEach((header, i) => {
		columnCharLengths[i] = header.content.length;
	});

	//Check cells
	data.cells.forEach((cell: Cell) => {
		let content = cell.content;
		//We have to do this for the .length function to be available
		const index = data.headers.findIndex(
			(header) => header.id === cell.headerId
		);
		if (columnCharLengths[index] < content.length)
			columnCharLengths[index] = content.length;
	});
	return columnCharLengths;
};
