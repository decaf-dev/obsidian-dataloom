import { App } from "obsidian";
import { createCell, createRow } from "./loom-state-factory";
import { LoomState } from "./types";
import { Column, Row, SourceType } from "./types/loom-state";

export default function addSourceRows(
	app: App,
	prevState: LoomState
): LoomState {
	const { sources, columns, rows } = prevState.model;
	let sourceRows: Row[] = [];
	sources.forEach((source) => {
		const { id, type, content } = source;
		switch (type) {
			case SourceType.FOLDER:
				sourceRows = getRowsFromFolder(
					app,
					columns,
					id,
					content,
					rows.length
				);
				break;
			case SourceType.TAG:
				sourceRows = getRowsFromTag(app, content);
				break;
			default:
				throw new Error(`Source type not handled: ${type}`);
		}
	});
	console.log(rows);
	const filteredRows = rows.filter((row) => row.sourceId === null);
	const nextRows = [...filteredRows, ...sourceRows];
	return {
		...prevState,
		model: {
			...prevState.model,
			rows: nextRows,
		},
	};
}

const getRowsFromFolder = (
	app: App,
	columns: Column[],
	sourceId: string,
	folderName: string,
	numRows: number
): Row[] => {
	const folder = app.vault.getAbstractFileByPath(folderName);
	if (!folder) return [];
	const files = app.vault.getMarkdownFiles().filter((file) => {
		return file.parent?.path === folder.path;
	});
	return files.map((file) => {
		const cells = columns.map((column) => {
			// const { name, path } = file;
			const { id, type } = column;
			const cell = createCell(id, { cellType: type });
			return cell;
		});
		const row = createRow(numRows, {
			cells,
			sourceId,
		});
		return row;
	});
};

const getRowsFromTag = (app: App, tagName: string): Row[] => {
	return [];
};
