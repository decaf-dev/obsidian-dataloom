import { v4 as uuid } from "uuid";
import { TableModel, Cell, ViewType } from "../table/types";
import { MarkdownTable } from "./types";

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

const MIN_TABLE_ROW_COUNT = 3;

export const findMarkdownTablesFromFileData = (
	data: string
): Map<string, MarkdownTable> => {
	const tables = new Map<string, MarkdownTable>();
	const lines = data.split("\n"); //TODO Does this work on windows? or do we need /r/n

	let tableBuffer: string[] = [];
	lines.forEach((line, i) => {
		let added = false;
		//If line is valid table row add to buffer
		if (line.match(MARKDOWN_TABLE_ROW_REGEX)) {
			tableBuffer.push(line);
			added = true;
		}
		//If 2 lines have been added, check to make sure that the 2nd row is a hyphen row
		if (tableBuffer.length === 2) {
			if (!tableBuffer[1].match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)) {
				tableBuffer = [];
				return;
			}
		}
		//If we didn't add a line
		if (!added) {
			//And we have atleast 3 lines
			if (tableBuffer.length >= MIN_TABLE_ROW_COUNT) {
				//And there is a table id e.g. "table-id-1"
				const tableId = findTableIdFromBuffer(tableBuffer);
				//Add the table
				if (tableId) {
					const lineEnd = i - 1;
					tables.set(tableId.trim(), {
						lineStart: lineEnd - tableBuffer.length + 1,
						lineEnd,
						text: tableBuffer.join("\n"),
					});
				}
			}
			tableBuffer = [];
		}
	});
	//If we finished parsing and we are left with a non-empty table buffer
	//add that as a table
	if (tableBuffer.length >= 3) {
		const tableId = findTableIdFromBuffer(tableBuffer);
		if (tableId) {
			const lineEnd = lines.length - 1;
			tables.set(tableId, {
				lineStart: lineEnd - tableBuffer.length + 1,
				lineEnd,
				text: tableBuffer.join("\n"),
			});
		}
	}
	return tables;
};

export const parseCellsFromEl = (
	el: HTMLElement,
	numColumns: number
): string[] => {
	const cells = [];
	const th = el.getElementsByTagName("th");
	for (let i = 0; i < th.length; i++) cells.push(th[i].innerHTML);

	const td = el.getElementsByTagName("td");
	for (let i = 0; i < td.length; i++) cells.push(td[i].innerHTML);
	return cells.filter((_cell, i) => i < cells.length - numColumns);
};

export const parseCellsFromMarkdown = (
	table: MarkdownTable,
	numColumns: number
): string[] => {
	//Fix this algorithm. It's need to handle
	//| 1 | 2 |
	//| --- | --- |
	//| cell-1 | cell-2 |
	//| table-id-1 | |
	//This code
	const split = table.text.split("\n");
	const combined = split.join(" ");
	let cells = combined.split("|");

	cells = cells.map((cell) => cell.trim());
	cells = cells.filter((cell) => cell !== "");
	cells = cells.filter((cell) => !cell.match(/^[-]{3,}$/));
	return cells.filter((_cell, i) => i < cells.length - numColumns);
};

export const tableIdFromEl = (el: HTMLElement): string | null => {
	const rows = el.getElementsByTagName("tr");
	const td = rows[rows.length - 1].getElementsByTagName("td");
	const cell = td[0].textContent;
	if (cell.match(TABLE_ID_REGEX)) return cell;
	return null;
};

export const findCurrentViewType = (el: HTMLElement): ViewType => {
	let currentViewType: ViewType = "reading";
	if (el.className.includes("markdown-rendered"))
		currentViewType = "live-preview";
	return currentViewType;
};

export const findTableModel = (
	contentTableCells: string[],
	textContentTableCells: string[],
	numColumns: number
): TableModel => {
	const cells: Cell[] = [];
	for (let i = 0; i < contentTableCells.length; i++) {
		cells.push({
			id: uuid(),
			content: contentTableCells[i],
			textContent: textContentTableCells[i],
		});
	}
	return {
		cells,
		numColumns,
	};
};
