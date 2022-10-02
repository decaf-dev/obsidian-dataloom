import { TableModel } from "../table/types";
import type { TFile } from "obsidian";
import NltPlugin from "../../main";

import { UNESCAPED_PIPE_REGEX } from "../string/regex";

import { createEmptyMarkdownTable } from "../random";

export const replaceUnescapedPipes = (markdown: string): string => {
	const matches = Array.from(markdown.matchAll(UNESCAPED_PIPE_REGEX));
	matches.forEach((match) => {
		const pipe = match[0];
		markdown = markdown.replace(pipe, pipe[0] + "\\|");
	});
	return markdown;
};

/**
 * Produces front matter from the table model
 */
export const serializeFrontMatter = (model: TableModel) => {
	const frontmatter = [];
	frontmatter.push("---");
	frontmatter.push(serializeColumnIds(model.columnIds));
	frontmatter.push(serializeRowIds(model.rowIds));
	frontmatter.push("---");
	return frontmatter.join("\n");
};

const serializeColumnIds = (columnIds: string[]) => {
	return `columnIds: ${JSON.stringify(columnIds)}`;
};

const serializeRowIds = (rowIds: string[]) => {
	return `rowIds: ${JSON.stringify(rowIds)}`;
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
	if (file) return <TFile>file;

	const createdFile = await plugin.app.vault.create(
		`${tableFolder}/${tableId}.md`,
		createEmptyMarkdownTable()
	);
	return createdFile;
};
