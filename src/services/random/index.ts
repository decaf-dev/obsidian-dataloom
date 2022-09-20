import { COLOR } from "../../constants";

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(COLOR).length);
	return Object.values(COLOR)[index];
};

export const randomTableId = () => {
	return `table-id-${randomId(6)}`;
};

export const randomRowId = () => {
	return `row-id-${randomId(8)}`;
};

export const randomColumnId = () => {
	return `column-id-${randomId(8)}`;
};

export const randomCellId = () => {
	return `cell-id-${randomId(8)}`;
};

export const randomId = (numChars: number) => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345679";
	let result = "";
	for (let i = 0; i < numChars; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
};

/**
 * Creates a 1 column NLT markdown table
 * @returns An NLT markdown table
 */
export const createEmptyMarkdownTable = (): string => {
	const columnIds = [randomColumnId()];
	const rowIds = [randomRowId(), randomRowId()];
	const rows: string[] = [];
	rows[0] = "---";
	rows[1] = `columnIds: ${JSON.stringify(columnIds)}`;
	rows[2] = `rowIds: ${JSON.stringify(rowIds)}`;
	rows[3] = "---";
	rows[4] = "";
	rows[5] = "| New Column |";
	rows[6] = "| ---------- |";
	rows[7] = "|          |";
	return rows.join("\n");
};
