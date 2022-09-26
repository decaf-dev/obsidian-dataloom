import MarkdownIt from "markdown-it";

import NltPlugin from "../../main";

import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "../../constants";
import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableState,
} from "../table/types";
import { findTableFile, initialCell } from "./utils";
import { SLASH_REGEX } from "../string/regex";

const md = new MarkdownIt();

export const markdownToHtml = (markdown: string) => {
	return md.renderInline(markdown, {});
};

interface ParsedTable {
	parsedCells: string[];
	parsedFrontmatter: string[];
	numRows: number;
	numColumns: number;
}

const parseTableFromMarkdown = (data: string): ParsedTable => {
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
			parsedCells.push(content);
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
	throw new Error(`Table definition file for ${tableId}: ${message}`);
};

const validateParsedTable = (
	parsedTable: ParsedTable,
	tableId: string
): {
	columnIds: string[];
	rowIds: string[];
	cellIds: string[];
} => {
	const { parsedFrontmatter, parsedCells, numColumns, numRows } = parsedTable;
	//Validate frontmatter
	if (parsedFrontmatter.length < 3)
		throwTableError(
			tableId,
			"missing frontmatter key 'columnIds', 'rowIds', or 'cellIds'"
		);

	if (parsedCells.length === 0)
		throwTableError(tableId, "file exists but no markdown was found");

	const columnIds = JSON.parse(parsedFrontmatter[0].split("columnIds: ")[1]);
	const rowIds = JSON.parse(parsedFrontmatter[1].split("rowIds: ")[1]);
	const cellIds = JSON.parse(parsedFrontmatter[2].split("cellIds: ")[1]);

	if (columnIds.length !== numColumns)
		throwTableError(tableId, "missing column ids");

	if (rowIds.length !== numRows) throwTableError(tableId, "missing rows ids");

	if (cellIds.length !== numColumns * numRows)
		throwTableError(tableId, "missing cells ids");
	return {
		columnIds,
		rowIds,
		cellIds,
	};
};

export const parseTableModelFromMarkdown = (
	data: string,
	tableId: string
): TableModel => {
	const parsedTable: ParsedTable = parseTableFromMarkdown(data);
	const { numRows, numColumns, parsedCells } = parsedTable;
	const { columnIds, rowIds, cellIds } = validateParsedTable(
		parsedTable,
		tableId
	);

	const tableModel: TableModel = {
		columns: [],
		rows: [],
		cells: [],
	};

	const { cells, rows, columns } = tableModel;

	for (let y = 0; y < numRows; y++) {
		for (let x = 0; x < numColumns; x++) {
			if (y === 0) columns.push(columnIds[x]);
			if (x === 0) rows.push(rowIds[y]);
			const cellId = cellIds[x + y * numColumns];
			const markdown = parsedCells[x + y * numColumns];
			const html = markdownToHtml(markdown);
			cells.push(
				initialCell(cellId, columnIds[x], rowIds[y], markdown, html)
			);
		}
	}
	return tableModel;
};

export const findTableModel = async (
	plugin: NltPlugin,
	tableId: string
): Promise<TableModel> => {
	//If it exists create it, otherwise don't
	const file = await findTableFile(plugin, tableId);
	const data = await app.vault.read(file);
	return parseTableModelFromMarkdown(data, tableId);
};

const validateSettings = (plugin: NltPlugin) => {
	const { tableFolder } = plugin.settings;
	if (tableFolder.match(SLASH_REGEX))
		throw new Error(
			"Table definition folder cannot include forward or back slashes. Please change it in the plugin settings."
		);
};

export const deserializeTable = async (
	plugin: NltPlugin,
	tableId: string
): Promise<TableState> => {
	if (DEBUG.LOAD_APP_DATA) {
		console.log("");
		console.log("deserializeTable()");
	}

	validateSettings(plugin);

	const model = await findTableModel(plugin, tableId);
	if (DEBUG.LOAD_APP_DATA) console.log("Found table model:", model);

	let tableState: TableState = {
		model,
		settings: {
			columns: {},
		},
		cacheVersion: CURRENT_TABLE_CACHE_VERSION,
	};

	const savedState = plugin.settings.data[tableId];
	if (savedState) {
		const { cacheVersion, settings } = savedState;

		if (DEBUG.LOAD_APP_DATA)
			console.log("Loading settings from cache", settings);
		//Update with old settings
		tableState.settings = settings;

		if (cacheVersion < CURRENT_TABLE_CACHE_VERSION) {
			//Handle old cache version
		}
	}
	//Add ids
	model.columns.forEach((columnId) => {
		if (!tableState.settings.columns[columnId])
			tableState.settings.columns[columnId] = DEFAULT_COLUMN_SETTINGS;
	});

	//Clean up old ids
	Object.keys(tableState.settings.columns).forEach((key) => {
		if (!model.columns.includes(key))
			delete tableState.settings.columns[key];
	});

	plugin.settings.data[tableId] = tableState;
	await plugin.saveSettings();
	return tableState;
};
