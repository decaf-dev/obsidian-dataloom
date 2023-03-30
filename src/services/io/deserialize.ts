import MarkdownIt from "markdown-it";

import NltPlugin from "../../main";

import { replaceUnescapedPipes } from "./utils";
import {
	EXTERNAL_LINK_REGEX,
	LEFT_SQUARE_BRACKET_REGEX,
	INTERNAL_LINK_REGEX,
	RIGHT_SQUARE_BRACKET_REGEX,
	INTERNAL_LINK_ALIAS_REGEX,
	COLUMN_ID_REGEX,
	ROW_ID_REGEX,
} from "../string/regex";

const md = new MarkdownIt();

const replaceObsidianLinks = (markdown: string): string => {
	const matches = Array.from(markdown.matchAll(INTERNAL_LINK_REGEX));
	matches.forEach((match) => {
		const link = match[0];
		let fileName = link
			.replace(LEFT_SQUARE_BRACKET_REGEX, "")
			.replace(RIGHT_SQUARE_BRACKET_REGEX, "");
		const alias = fileName.match(INTERNAL_LINK_ALIAS_REGEX);
		if (alias) fileName = fileName.replace(INTERNAL_LINK_ALIAS_REGEX, "");

		const file = NltPlugin.getFiles().find(
			(file) => file.basename === fileName
		);

		const el = document.body.createEl("a");
		el.addClass("internal-link");
		if (!file) el.addClass("is-unresolved");
		el.setAttr("data-href", fileName);
		el.setAttr("href", fileName);
		el.setAttr("target", "_blank");
		el.setAttr("rel", "noopener");
		if (alias) {
			el.setText(alias[0].substring(1));
			el.setAttr("aria-label-position", "top");
			el.setAttr("aria-label", fileName);
		} else {
			el.setText(fileName);
		}
		el.remove();

		markdown = markdown.replace(link, el.outerHTML);
	});
	return markdown;
};

const replaceExternalLinks = (markdown: string): string => {
	const matches = Array.from(markdown.matchAll(EXTERNAL_LINK_REGEX));
	matches.forEach((match) => {
		const link = match[0];
		markdown = markdown.replace(
			link,
			`<a rel="noopener" class="external-link" href="${link}" target="_blank">${link}</a>`
		);
	});
	return markdown;
};

export const markdownToHtml = (markdown: string) => {
	markdown = md.renderInline(markdown, {});
	markdown = replaceObsidianLinks(markdown);
	markdown = replaceExternalLinks(markdown);
	return markdown;
};

interface ParsedTable {
	parsedCells: string[];
	parsedFrontmatter: string[];
	numRows: number;
	numColumns: number;
}

export const parseTableFromMarkdown = (data: string): ParsedTable => {
	const tokens = md.parse(data, {});

	let parsedFrontmatter: string[];
	let shouldParseFrontMatter = false;

	for (let i = 0; i < tokens.length; i++) {
		const { type, content } = tokens[i];
		if (type === "hr") shouldParseFrontMatter = true;
		else if (type === "inline" && shouldParseFrontMatter) {
			shouldParseFrontMatter = false;
			parsedFrontmatter = content.split("\n");
			break;
		}
	}

	const parsedCells: string[] = [];
	let shouldParseTable = false;
	let shouldParseRow = false;
	let numColumns = 0;
	let numRows = 0;

	for (let i = 0; i < tokens.length; i++) {
		const { type, content } = tokens[i];
		if (type === "table_open") shouldParseTable = true;
		else if (type === "table_close") shouldParseTable = false;
		else if (type === "tr_open") shouldParseRow = true;
		else if (type === "tr_close") {
			shouldParseRow = false;
			numRows++;
		} else if (type === "inline" && shouldParseTable && shouldParseRow) {
			let markdown = content;
			//We need to replace unescaped pipes because markdown.it will parse `\|` as `|`
			markdown = replaceUnescapedPipes(markdown);
			parsedCells.push(markdown);
			if (numRows === 0) numColumns++;
		}
	}

	return {
		parsedCells,
		parsedFrontmatter,
		numRows,
		numColumns,
	};
};

const throwTableError = (tableId: string, message: string) => {
	throw new Error(`${tableId}: ${message}`);
};

const validateParsedTable = (
	parsedTable: ParsedTable,
	tableId: string
): {
	columnIds: string[];
	rowIds: string[];
} => {
	const { parsedFrontmatter, parsedCells, numColumns, numRows } = parsedTable;
	//Validate frontmatter
	if (parsedFrontmatter.length < 2)
		throwTableError(
			tableId,
			"missing frontmatter key 'columnIds' or 'rowIds'"
		);

	if (parsedCells.length === 0)
		throwTableError(tableId, "file exists but no markdown was found");

	const columnIds: string[] = JSON.parse(
		parsedFrontmatter[0].split("columnIds: ")[1]
	);
	const rowIds: string[] = JSON.parse(
		parsedFrontmatter[1].split("rowIds: ")[1]
	);

	if (columnIds.length !== numColumns)
		throwTableError(tableId, "missing column ids");

	if (rowIds.length !== numRows) throwTableError(tableId, "missing rows ids");

	columnIds.forEach((id) => {
		if (!id.match(COLUMN_ID_REGEX))
			throwTableError(tableId, `invalid column id "${id}"`);
	});

	rowIds.forEach((id) => {
		if (!id.match(ROW_ID_REGEX))
			throwTableError(tableId, `invalid row id "${id}"`);
	});

	return {
		columnIds,
		rowIds,
	};
};
