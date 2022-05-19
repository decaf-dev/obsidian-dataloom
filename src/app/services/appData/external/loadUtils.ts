import { MARKDOWN_CELLS_REGEX, MARKDOWN_ROWS_REGEX } from "../../string/regex";
import { isMarkdownTable } from "../../string/validators";
import { stripLinks, sanitizeHTML } from "../../string/strippers";
import { ViewType } from "../state/saveData";

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
