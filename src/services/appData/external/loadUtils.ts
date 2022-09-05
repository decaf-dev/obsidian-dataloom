import { v4 as uuid } from "uuid";
import CRC32 from "crc-32";

import { initialHeader, initialRow } from "../state/initialState";
import { Header, Row, AppData, Cell, Tag } from "../state/types";

import { MARKDOWN_CELLS_REGEX, MARKDOWN_ROWS_REGEX } from "../../string/regex";
import { ViewType } from "../state/saveState";
import { initialCell } from "../state/initialState";
import { getCurrentTimeWithOffset } from "../../random";

/**
 * Parses data for an individual table.
 * This is not used for all file data. It is intended to be used
 * on one table returned from findMarkdownTablesFromFileData
 *
 * We assume that this is a valid markdown table
 * @param data The data for one table. No more, no less.
 * @returns A parsed table representation
 */
//TODO make sure this works 100%, 100% of the time
export const parseTableFromMarkdown = (data: string): string[][] => {
	//Start by breaking up everything into rows based off of a row syntax | ---- |
	const rows = data.match(MARKDOWN_ROWS_REGEX);

	const table = [];
	//For each row, parse each cell
	for (let i = 0; i < rows.length; i++) {
		let cells = rows[i].match(MARKDOWN_CELLS_REGEX);
		cells = cells.map((cell) => cell.replace(/\|/g, "").trim());
		cells = cells.filter(
			(cell) => (cell.match("-{3,}") || []).length === 0
		);

		if (cells.length !== 0) table.push(cells);
	}
	return table;
};

export const parseTableFromEl = (el: HTMLElement): string[][] => {
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
			row.push(td[j].innerHTML);
		}
		table.push(row);
	}
	return table;
};

export const findCurrentViewType = (el: HTMLElement): ViewType => {
	let currentViewType: ViewType = "reading";
	if (el.className.includes("markdown-rendered"))
		currentViewType = "live-preview";
	return currentViewType;
};

export const hashHeaders = (headers: string[]): number => {
	return CRC32.str(
		headers.reduce((concat, header) => (concat += header), "")
	);
};

export const findAppData = (
	contentTable: string[][],
	textContentTable: string[][]
): AppData => {
	const headers: Header[] = [];
	const rows: Row[] = [];
	const cells: Cell[] = [];
	const tags: Tag[] = [];

	contentTable.forEach((parsedRow, i) => {
		if (i === 0) {
			parsedRow.forEach((th, j) => {
				headers.push(initialHeader(uuid(), th, textContentTable[0][j]));
			});
		} else {
			const row = initialRow(uuid(), getCurrentTimeWithOffset());
			parsedRow.forEach((td, j) => {
				//The first time we load the data, set the cell as a text cell
				//Once we merge the new data with the old data, we can set the cell
				//types again
				const cell = initialCell(
					uuid(),
					headers[j].id,
					row.id,
					headers[j].type,
					td,
					textContentTable[i][j]
				);
				cells.push(cell);
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
