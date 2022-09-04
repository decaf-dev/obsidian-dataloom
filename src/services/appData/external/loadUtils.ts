import { v4 as uuid } from "uuid";
import CRC32 from "crc-32";

import { initialHeader, initialRow } from "../state/initialState";
import { Header, Row, AppData, Cell, Tag } from "../state/types";

import {
	MARKDOWN_CELLS_REGEX,
	MARKDOWN_ROWS_REGEX,
	AMPERSAND_CHARACTER_REGEX,
	LINE_BREAK_CHARACTER_REGEX,
} from "../../string/regex";
import { isMarkdownTable, isCheckBoxChecked } from "../../string/validators";
import { stripLinks, sanitizeHTML } from "../../string/strippers";
import { ViewType } from "../state/saveState";
import { findContentType } from "../../string/matchers";
import { initialCell } from "../state/initialState";
import { getCurrentTimeWithOffset } from "../../random";
import {
	parseBoldTags,
	parseHighlightTags,
	parseItalicTags,
	parseUnderlineTags,
} from "../../string/parsers";

import { AMPERSAND, BREAK_LINE_TAG } from "src/constants";

/**
 * Parses data for an individual table.
 * This is not used for all file data. It is intended to be used
 * on one table returned from findMarkdownTablesFromFileData
 *
 * We assume that this is a valid markdown table
 * @param data The data for one table. No more, no less.
 * @returns A parsed table representation
 */
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
			let sanitized = sanitizeHTML(td[j].innerHTML);
			sanitized = stripLinks(sanitized);
			row.push(sanitized);
		}
		table.push(row);
	}
	return table;
};

export const findMarkdownTablesFromFileData = (data: string): string[] => {
	//We match groups of lines that follow the markdown table syntax
	// | line 1  |
	// | line 2  |
	const matches = data.match(/(\|.*\|(\r\n|\r|\n){0,1}){1,}/g) || [];
	//From there we check if this is actually a table
	//We will just look for the hyphen row with each cell having at least 3 hyphens
	return matches.filter((match) => isMarkdownTable(match));
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

export const findAppData = (parsedTable: string[][]): AppData => {
	const headers: Header[] = [];
	const rows: Row[] = [];
	const cells: Cell[] = [];
	const tags: Tag[] = [];

	parsedTable.forEach((parsedRow, i) => {
		if (i === 0) {
			parsedRow.forEach((th, j) => {
				headers.push(initialHeader(uuid(), th));
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
					td
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

// content = content.replace(LINE_BREAK_CHARACTER_REGEX("g"), BREAK_LINE_TAG);
// content = content.replace(AMPERSAND_CHARACTER_REGEX("g"), AMPERSAND);

// content = parseBoldTags(content);
// content = parseItalicTags(content);
// content = parseHighlightTags(content);
// content = parseUnderlineTags(content);

// 	if (this.isChecked) {
// 		return "[x]";
// 	} else {
// 		return "[ ]";
// 	}

// 		toString() {
// 	if (this.date !== null) {
// 		const day = ("0" + this.date.getDate()).slice(-2);
// 		const month = ("0" + (this.date.getMonth() + 1)).slice(-2);
// 		const year = this.date.getFullYear();
// 		return `${year}/${month}/${day}`;
// 	} else {
// 		return "";
// 	}
// }
