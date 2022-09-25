import { Cell, ColumnId, RowId, TableModel } from "../table/types";
import { TFile } from "obsidian";
import NltPlugin from "../../main";

import { createEmptyMarkdownTable } from "../random";

/**
 * Produces front matter from the table model
 */
export const serializeFrontMatter = (model: TableModel) => {
	const frontmatter = [];
	frontmatter.push("---");
	frontmatter.push(serializeColumns(model.columns));
	frontmatter.push(serializeRows(model.rows));
	frontmatter.push("---");
	return frontmatter.join("\n");
};

const serializeColumns = (columns: ColumnId[]) => {
	return `columnIds: ${JSON.stringify(columns)}`;
};

const serializeRows = (rows: RowId[]) => {
	return `rowIds: ${JSON.stringify(rows)}`;
};

export const findTableFile = async (
	plugin: NltPlugin,
	tableId: string
): Promise<TFile | null> => {
	const tableFolder = plugin.settings.tableFolder;
	const folder = plugin.app.vault.getAbstractFileByPath(tableFolder);
	if (!folder) await plugin.app.vault.createFolder(tableFolder);

	const file = plugin.app.vault.getAbstractFileByPath(
		`${tableFolder}/${tableId}.md`
	);
	if (file && file instanceof TFile) return file;

	const createdFile = await plugin.app.vault.create(
		`${tableFolder}/${tableId}.md`,
		createEmptyMarkdownTable()
	);
	return createdFile;
};

export const initialCell = (
	id: string,
	columnId: string,
	rowId: string,
	markdown: string,
	html: string
): Cell => {
	return {
		id,
		columnId,
		rowId,
		markdown,
		html,
	};
};
