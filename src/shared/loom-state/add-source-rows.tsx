import { App } from "obsidian";
import { createCell, createRow } from "./loom-state-factory";
import { CellType, Column, Row, Source, SourceType } from "./types/loom-state";

export default function addSourceRows(
	app: App,
	sources: Source[],
	columns: Column[],
	rows: Row[]
): Row[] {
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
	const filteredRows = rows.filter((row) => row.sourceId === null);
	const nextRows = [...filteredRows, ...sourceRows];
	return nextRows;
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
			const { path } = file;
			const { id, type } = column;

			let content = "";
			if (type === CellType.SOURCE_FILE) content = path;
			const cell = createCell(id, { cellType: type, content });
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
