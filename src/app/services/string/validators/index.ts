import {
	MARKDOWN_CELLS_REGEX,
	MARKDOWN_HYPHEN_CELL_REGEX,
	MARKDOWN_ROWS_REGEX,
	NUMBER_REGEX,
	TAG_REGEX,
} from "src/app/services/string/regex";

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

export const isValidTypeDefinitionRow = (parsedTable: string[][]): boolean => {
	if (parsedTable.length < 3) return false;
	const row = parsedTable[2];

	for (let i = 0; i < row.length; i++) {
		const cell = row[i];
		if (!Object.values(CELL_TYPE).includes(cell)) return false;
	}
	return true;
};
