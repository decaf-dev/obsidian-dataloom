import { v4 as uuid } from "uuid";
import { TableModel, Cell } from "../table/types";
import { MarkdownTable } from "./types";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

/**
 * Matches a table id
 * e.g. "table-id-123456"
 */
export const TABLE_ID_REGEX = new RegExp(
	/^[ \t]{0,}table-id-[a-zA-Z0-9-]{1,}[ \t]{0,}$/
);

/**
 * Matches a markdown table row
 * e.g. "| cell 1 | cell 2 |"
 */
export const MARKDOWN_TABLE_ROW_REGEX = new RegExp(
	/^[ \t]{0,}\|([ \t]{0,}.*[ \t]{0,}\|){2,}[ \t]{0,}$/
);

/**
 * Matches a markdown table hyphen row
 * e.g. "| --- | --- |"
 */
export const MARKDOWN_TABLE_HYPHEN_ROW_REGEX = new RegExp(
	/^[ \t]{0,}\|([ \t]{0,}[-]{3,}[ \t]{0,}\|){2,}[ \t]{0,}$/
);

const findTableIdFromBuffer = (tableBuffer: string[]): string | null => {
	const lastRow = tableBuffer[tableBuffer.length - 1];
	const tableId = lastRow.split("|")[1];
	if (tableId.match(TABLE_ID_REGEX)) return tableId.trim();
	return null;
};

const getTableEntryFromBuffer = (
	buffer: string[],
	lineStart: number,
	lineEnd: number
): {
	tableId: string;
	value: MarkdownTable;
} => {
	//Header row, hyphen row, table id row
	if (buffer.length < 3) return null;
	if (!buffer[1].match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)) return null;
	const tableId = findTableIdFromBuffer(buffer);
	if (!tableId) return null;
	return {
		tableId,
		value: {
			text: buffer.join("\n"),
			lineStart,
			lineEnd,
		},
	};
};

export const findMarkdownTablesFromFileData = (
	data: string
): Map<string, MarkdownTable> => {
	interface MarkdownTableRow {
		text: string;
		lineIndex: number;
	}

	const tables = new Map<string, MarkdownTable>();
	const tableRows: MarkdownTableRow[] = [];

	//Get each markdown table row
	const lines = data.split("\n");
	lines.forEach((line, i) => {
		if (line.match(MARKDOWN_TABLE_ROW_REGEX)) {
			tableRows.push({
				lineIndex: i,
				text: line,
			});
		}
	});

	let tableBuffer: string[] = [];
	let lineStart = 0;
	let lastRow: MarkdownTableRow | null = null;

	//Match markdown tables
	tableRows.forEach((row, i) => {
		const { text, lineIndex } = row;
		//If the line index is sequential from the last index, indicating
		//that it is part of the table
		if (lineIndex === lineStart + tableBuffer.length) {
			tableBuffer.push(text);
			lastRow = row;
			if (i === tableRows.length - 1) {
				const entry = getTableEntryFromBuffer(
					tableBuffer,
					lineIndex - tableBuffer.length + 1,
					lineIndex
				);
				if (entry) tables.set(entry.tableId, entry.value);
			}
		} else {
			//Check if a valid table has been produced
			if (lastRow) {
				const entry = getTableEntryFromBuffer(
					tableBuffer,
					lastRow.lineIndex - tableBuffer.length + 1,
					lastRow.lineIndex
				);
				if (entry) tables.set(entry.tableId, entry.value);
			}
			tableBuffer = [];
			tableBuffer.push(text);
			lineStart = lineIndex;
		}
	});
	return tables;
};

export const parseCellsFromEl = (el: HTMLElement): string[] => {
	const cells = [];
	const th = el.getElementsByTagName("th");
	for (let i = 0; i < th.length; i++) cells.push(th[i].innerHTML);

	const td = el.getElementsByTagName("td");
	for (let i = 0; i < td.length; i++) cells.push(td[i].innerHTML);
	return cells;
};

export const parseCellsFromMarkdownTable = (table: MarkdownTable): string[] => {
	const parsed = md.parse(table.text, {});
	const cells: string[] = [];
	parsed.forEach((token) => {
		if (token.type === "inline") cells.push(token.content);
	});
	return cells;
};

export const tableIdFromEl = (el: HTMLElement): string | null => {
	const rows = el.getElementsByTagName("tr");
	const lastRow = rows[rows.length - 1];
	const td = lastRow.getElementsByTagName("td");
	const cell = td[0].textContent;
	if (cell.match(TABLE_ID_REGEX)) return cell;
	return null;
};

export const findTableModel = (
	contentTableCells: string[],
	textContentTableCells: string[],
	numColumns: number
): TableModel => {
	let cells: Cell[] = [];
	for (let i = 0; i < contentTableCells.length; i++) {
		cells.push({
			id: uuid(),
			content: contentTableCells[i],
			textContent: textContentTableCells[i],
		});
	}
	cells = cells.filter((_cell, i) => i < cells.length - numColumns);
	return {
		cells,
		numColumns,
	};
};
