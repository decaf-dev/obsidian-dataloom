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

export const randomCell = (rowId: string, columnId: string): Cell => {
	return {
		id: randomCellId(),
		markdown: "",
		html: "",
		rowId,
		columnId,
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
export const createEmptyMarkdownTable = (): string => {
	const columnId = randomColumnId();
	const rowId1 = randomRowId();
	const rowId2 = randomRowId();

	const model: TableModel = {
		cells: [randomCell(rowId1, columnId), randomCell(rowId2, columnId)],
		columns: [columnId],
		rows: [rowId1, rowId2],
	};
	const frontmatter = serializeFrontMatter(model);
	return frontmatter + "\n" + emptyMarkdownTable();
};
