import MarkdownIt from "markdown-it";

import NltPlugin, { DEFAULT_SETTINGS } from "../../main";

import { CURRENT_PLUGIN_VERSION } from "../../constants";
import {
	DEFAULT_COLUMN_SETTINGS,
	DEFAULT_ROW_SETTINGS,
	TableModel,
	TableState,
} from "../table/types";
import { findTableFile, replaceUnescapedPipes } from "./utils";
import {
	EXTERNAL_LINK_REGEX,
	LEFT_SQUARE_BRACKET_REGEX,
	INTERNAL_LINK_REGEX,
	RIGHT_SQUARE_BRACKET_REGEX,
	SLASH_REGEX,
	INTERNAL_LINK_ALIAS_REGEX,
	COLUMN_ID_REGEX,
	ROW_ID_REGEX,
} from "../string/regex";
import { randomCellId, randomColumnId, randomRowId } from "../random";
import { generateEmptyMarkdownTable } from "../random";
import { logVar } from "../debug";

const FILE_NAME = "deserialize";

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

export const parseTableModelFromParsedTable = (
	table: ParsedTable
): TableModel => {
	const { numRows, numColumns } = table;
	const columnIds = Array(numColumns)
		.fill(0)
		.map((_i) => randomColumnId());
	const rowIds = Array(numRows)
		.fill(0)
		.map((_i) => randomRowId());
	return parseTableModel(table, columnIds, rowIds);
};

const parseTableModel = (
	table: ParsedTable,
	columnIds: string[],
	rowIds: string[]
): TableModel => {
	const model: TableModel = {
		columnIds: [],
		rowIds: [],
		cells: [],
	};

	const { numRows, numColumns, parsedCells } = table;

	for (let y = 0; y < numRows; y++) {
		for (let x = 0; x < numColumns; x++) {
			if (y === 0) model.columnIds.push(columnIds[x]);
			if (x === 0) model.rowIds.push(rowIds[y]);
			const markdown = parsedCells[x + y * numColumns];
			const html = markdownToHtml(markdown);
			model.cells.push({
				id: randomCellId(),
				columnId: columnIds[x],
				rowId: rowIds[y],
				markdown,
				html,
				isHeader: y === 0,
			});
		}
	}
	return model;
};

export const parseTableModelFromFileData = (
	data: string,
	tableId: string
): TableModel => {
	const parsedTable: ParsedTable = parseTableFromMarkdown(data);
	const { columnIds, rowIds } = validateParsedTable(parsedTable, tableId);
	return parseTableModel(parsedTable, columnIds, rowIds);
};

export const findTableModel = async (
	plugin: NltPlugin,
	tableId: string
): Promise<TableModel> => {
	//If it exists create it, otherwise don't
	const { file, isNewFile } = await findTableFile(plugin, tableId);
	if (isNewFile)
		await plugin.app.vault.modify(file, generateEmptyMarkdownTable());
	const data = await app.vault.read(file);
	return parseTableModelFromFileData(data, tableId);
};

const validateSettings = (plugin: NltPlugin) => {
	// const { tableFolder } = plugin.settings;
	// if (tableFolder.match(SLASH_REGEX))
	// 	throw new Error(
	// 		"Table definition folder cannot include forward or back slashes. Please change it in the plugin settings."
	// 	);
};

export const deserializeTable = async (
	plugin: NltPlugin,
	tableId: string
): Promise<TableState> => {
	const shouldDebug = plugin.settings.shouldDebug;

	//Migration for 4.3.1 or earlier
	if (plugin.settings.shouldClear) {
		console.log("Clearing previous NLT plugin settings");
		plugin.settings = { ...DEFAULT_SETTINGS };
		plugin.settings.shouldClear = false;
		await plugin.saveSettings();
	}

	validateSettings(plugin);

	const model = await findTableModel(plugin, tableId);
	logVar(
		shouldDebug,
		FILE_NAME,
		"deserializeTable",
		"Loaded table model from definition file",
		model
	);

	let tableState: TableState = {
		model,
		settings: {
			columns: {},
			rows: {},
		},
		pluginVersion: CURRENT_PLUGIN_VERSION,
	};

	const savedState = plugin.settings.data[tableId];
	if (savedState) {
		const { pluginVersion, settings } = savedState;

		logVar(
			shouldDebug,
			FILE_NAME,
			"deserializeTable",
			"Found cached table settings",
			settings
		);

		//Update with old settings
		tableState.settings = settings;

		if (pluginVersion < CURRENT_PLUGIN_VERSION) {
			//Handle table produced by older plugin version
		}
	}
	//Add ids
	model.columnIds.forEach((id) => {
		if (!tableState.settings.columns[id])
			tableState.settings.columns[id] = { ...DEFAULT_COLUMN_SETTINGS };
	});

	model.rowIds.forEach((id, i) => {
		if (!tableState.settings.rows[id]) {
			tableState.settings.rows[id] = { ...DEFAULT_ROW_SETTINGS };
			//Offset the time so that we can sort by this date
			tableState.settings.rows[id].creationDate = Date.now() + i;
		}
	});

	//Clean up old ids
	Object.keys(tableState.settings.columns).forEach((key) => {
		if (!model.columnIds.includes(key))
			delete tableState.settings.columns[key];
	});

	//Clean up old ids
	Object.keys(tableState.settings.rows).forEach((key) => {
		if (!model.rowIds.includes(key)) delete tableState.settings.rows[key];
	});

	plugin.settings.data[tableId] = tableState;
	await plugin.saveSettings();
	return tableState;
};
