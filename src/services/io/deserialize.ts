import MarkdownIt from "markdown-it";
import { v4 as uuid } from "uuid";

import NltPlugin from "../../main";

import { CURRENT_TABLE_CACHE_VERSION, DEBUG } from "../../constants";
import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableState,
} from "../table/types";
import { findTableFile, initialCell } from "./utils";
import { randomCellId } from "../random";

const md = new MarkdownIt();

export const markdownToHtml = (markdown: string) => {
	return md.render(markdown, {});
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
			} else {
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

	// parsedCells.forEach((cellMarkdown, i) => {
	// 	const { cells, rows, columns } = tableModel;
	// 	const rowIndex = getRowIndex(i, numColumns);
	// 	const columnIndex = getColumnIndex(i, numColumns);

	// 	const html = markdownToHtml(cellMarkdown);
	// 	if (rowIndex === 0) {
	// 		const columnId = uuid();
	// 		columns.push(columnId);
	// 	}
	// 	if (rows.length !== rowIndex + 1) {
	// 		const rowId = uuid();
	// 		rows.push(rowId);
	// 	}
	// 	const cellId = randomCellId();
	// 	cells.push(
	// 		initialCell(
	// 			cellId,
	// 			columns[columnIndex],
	// 			rows[rowIndex],
	// 			cellMarkdown,
	// 			html
	// 		)
	// 	);
	// });
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

export const loadTableState = async (
	plugin: NltPlugin,
	tableId: string
): Promise<TableState> => {
	if (DEBUG.LOAD_APP_DATA) {
		console.log("");
		console.log("loadTableState()");
	}

	const model = await findTableModel(plugin, tableId);
	console.log("MODEL", model);

	let tableState: TableState | null = null;
	const savedState = plugin.settings.data[tableId];
	if (savedState) {
		const { cacheVersion } = savedState;
		if (DEBUG.LOAD_APP_DATA)
			console.log("Loading table settings from cache.");
		tableState = { ...savedState };
		tableState.model = model;

		if (cacheVersion < CURRENT_TABLE_CACHE_VERSION)
			tableState.cacheVersion = CURRENT_TABLE_CACHE_VERSION;
	} else {
		const entries: any = [];
		model.columns.forEach((columnId) => {
			entries.push([columnId, DEFAULT_COLUMN_SETTINGS]);
		});
		const columnSettings = Object.fromEntries(entries);
		tableState = {
			model: model,
			settings: {
				columns: columnSettings,
			},
			cacheVersion: CURRENT_TABLE_CACHE_VERSION,
		};
		//When a user adds a new table, this entry will initially be null, we need to set this
		//so a user can add rows/columns via hotkeys
		plugin.settings.data = {};
	}
	plugin.settings.data[tableId] = tableState;
	await plugin.saveSettings();
	return tableState;
};
