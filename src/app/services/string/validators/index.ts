import {
	COLUMN_ID_REGEX,
	MARKDOWN_CELLS_REGEX,
	MARKDOWN_HYPHEN_CELL_REGEX,
	MARKDOWN_ROWS_REGEX,
	NUMBER_REGEX,
	TAG_REGEX,
	DATE_REGEX,
	ROW_ID_REGEX,
} from "src/app/services/string/regex";

import { CELL_TYPE } from "src/app/constants";

export const isMarkdownTable = (data: string): boolean => {
	const rows = data.match(MARKDOWN_ROWS_REGEX);

	if (rows && rows.length >= 2) {
		const headerRow = rows[0];
		const headerCells = headerRow.match(MARKDOWN_CELLS_REGEX);
		const hyphenRow = rows[1];
		const hyphenCells = hyphenRow.match(MARKDOWN_CELLS_REGEX);

		if (hyphenCells.length < headerCells.length) return false;

		for (let j = 0; j < hyphenCells.length; j++) {
			const cell = hyphenCells[j];
			if (!cell.match(MARKDOWN_HYPHEN_CELL_REGEX)) return false;
		}
		return true;
	}
	return false;
};

export const isNumber = (input: string) => {
	return (input.match(NUMBER_REGEX) || []).length !== 0;
};

export const isDate = (input: string) => {
	return (input.match(DATE_REGEX) || []).length !== 0;
};

export const isTag = (input: string) => {
	return (input.match(TAG_REGEX) || []).length !== 0;
};

/**
 * Checks to see if input string starts and ends with double square brackets
 * @param input The input string
 * @returns Has square brackets or not
 */
export const hasSquareBrackets = (input: string): boolean => {
	if (input.match(/(^\[\[)(.*)(]]$)/)) return true;
	return false;
};

/**
 * Checks to see if the header's last cell is empty
 * @param parsedTable The parsed table
 * @returns Whether or not the header is valid
 */
export const hasValidHeaderRow = (parsedTable: string[][]): boolean => {
	const row = parsedTable[0];
	if (row) {
		if (row[row.length - 1] === "") return true;
	}
	return false;
};

export const hasValidTypeDefinitionRow = (parsedTable: string[][]): boolean => {
	const row = parsedTable[1];
	if (row) {
		for (let i = 0; i < row.length; i++) {
			const cell = row[i];
			if (i === row.length - 1) {
				if (cell !== "") return false;
			} else {
				if (!Object.values(CELL_TYPE).includes(cell)) return false;
			}
		}
		return true;
	}
	return false;
};

export const hasValidColumnIds = (parsedTable: string[][]): boolean => {
	const ids: string[] = [];
	const row = parsedTable[2];
	if (row) {
		for (let i = 0; i < row.length - 1; i++) {
			const cell = row[i];
			if (!cell.match(COLUMN_ID_REGEX)) return false;

			//Check to see if the id has already been added
			const id = cell.split("column-id-")[1];
			if (ids.includes(id)) return false;
			ids.push(id);
		}
		return true;
	} else {
		return false;
	}
};

export const hasValidRowIds = (parsedTable: string[][]): boolean => {
	const ids: string[] = [];
	if (parsedTable.length < 3) return false;

	for (let i = 3; i < parsedTable.length; i++) {
		const row = parsedTable[i];
		const cell = row[row.length - 1];

		if (!cell.match(ROW_ID_REGEX)) return false;

		//Check the id has already been added
		const id = cell.split("row-id-")[1];
		if (ids.includes(id)) return false;
		ids.push(id);
	}
	return true;
};
