import { App } from "obsidian";
import { createCell, createRow } from "./loom-state-factory";
import { CellType, Column, Row, Source, SourceType } from "./types/loom-state";

export default function findSourceRows(
	app: App,
	sources: Source[],
	columns: Column[],
	rows: Row[]
): Row[] {
	return sources
		.map((source) => {
			const { id, type, content } = source;
			switch (type) {
				case SourceType.FOLDER:
					return findRowsFromFolder(
						app,
						columns,
						id,
						content,
						rows.length
					);
				case SourceType.TAG:
					return findRowsFromTag(app, content);
				default:
					throw new Error(`Source type not handled: ${type}`);
			}
		})
		.flat();
}

const findRowsFromFolder = (
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

const findRowsFromTag = (app: App, tagName: string): Row[] => {
	return [];
};
