import MarkdownIt from "markdown-it";

import NltPlugin from "../../main";

import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "../../constants";
import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableState,
} from "../table/types";
import { findTableFile, initialCell } from "./utils";
import { randomCellId } from "../random";
import { SLASH_REGEX } from "../string/regex";

const md = new MarkdownIt();

export const markdownToHtml = (markdown: string) => {
	return md.renderInline(markdown, {});
};

export const parseTableModelFromMarkdown = (data: string): TableModel => {
	const parsedTokens = md.parse(data, {});

	const parsedCells: string[] = [];
	let frontmatter: string[] = [];

	let parseTable = false;
	let parseFrontMatter = false;
	parsedTokens.forEach((token, i) => {
		if (token.type === "hr") parseFrontMatter = true;
		if (token.type === "table_open") parseTable = true;
		if (token.type === "inline") {
			if (parseFrontMatter) {
				parseFrontMatter = false;
				frontmatter = token.content.split("\n");
			} else if (parseTable) {
				parsedCells.push(token.content);
			}
		}
	});

	if (parsedCells.length === 0) throw new Error("Missing markdown table.");

	if (frontmatter.length < 2)
		throw new Error("Invalid frontmatter. Missing columnIds or rowIds.");
	const columnIds = JSON.parse(frontmatter[0].split("columnIds: ")[1]);
	const rowIds = JSON.parse(frontmatter[1].split("rowIds: ")[1]);

	const numColumns = Object.values(columnIds).length;
	const numRows = Object.values(rowIds).length;
	const idSize = numColumns * numRows;
	if (parsedCells.length !== idSize) {
		throw new Error(
			`Parsed size: ${parsedCells.length} doesn't match id size: ${idSize}`
		);
	}

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
			const cellId = randomCellId();
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
	return parseTableModelFromMarkdown(data);
};

const validateSettings = (plugin: NltPlugin) => {
	const { tableFolder, syncInterval } = plugin.settings;
	if (tableFolder.match(SLASH_REGEX))
		throw new Error(
			"Table definition folder cannot include forward or back slashes. Please change it in the plugin settings."
		);
	if (syncInterval === 0) throw new Error("Sync interval cannot be empty.");
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
