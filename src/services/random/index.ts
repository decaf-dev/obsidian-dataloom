import { COLOR } from "../../constants";
import { serializeFrontMatter } from "../io/utils";
import { TableModel, Cell } from "../table/types";

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

export const randomTagId = () => {
	return `tag-id-${randomId(8)}`;
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

export const randomCell = (
	columnId: string,
	rowId: string,
	isHeader: boolean
): Cell => {
	return {
		id: randomCellId(),
		columnId,
		rowId,
		markdown: "",
		html: "",
		isHeader,
	};
};

const emptyMarkdownTable = (): string => {
	const table: string[] = [];
	table.push("| New Column |");
	table.push("| -------- |");
	table.push("|          |");
	return table.join("\n");
};

/**
 * Creates a 1 column NLT markdown table
 * @returns An NLT markdown table
 */
export const generateEmptyMarkdownTable = (): string => {
	const columnId = randomColumnId();
	const rowId1 = randomRowId();
	const rowId2 = randomRowId();

	const model: TableModel = {
		cells: [
			randomCell(columnId, rowId1, true),
			randomCell(columnId, rowId2, false),
		],
		columnIds: [columnId],
		rowIds: [rowId1, rowId2],
	};
	const frontmatter = serializeFrontMatter(model);
	return frontmatter + "\n" + emptyMarkdownTable();
};

export const generateNLTCodeBlock = (tableId = ""): string => {
	if (tableId === "") tableId = randomTableId();
	const codeblock: string[] = [];
	codeblock.push("```notion-like-tables");
	codeblock.push(tableId);
	codeblock.push("```");
	return codeblock.join("\n");
};
