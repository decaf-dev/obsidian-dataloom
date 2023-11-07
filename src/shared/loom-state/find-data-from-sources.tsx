import { App } from "obsidian";
import { createCell, createRow } from "./loom-state-factory";
import {
	Cell,
	CellType,
	Column,
	ObsidianFolderSource,
	Row,
	Source,
	SourceType,
} from "./types/loom-state";

import { deserializeFrontmatterForCell } from "../deserialize-frontmatter";
import { cloneDeep } from "lodash";

export default function findDataFromSources(
	app: App,
	sources: Source[],
	columns: Column[],
	numRows: number
): {
	newRows: Row[];
	nextColumns: Column[];
} {
	const newRows: Row[] = [];
	let nextColumns: Column[] = cloneDeep(columns);

	sources.forEach((source) => {
		const { id, type } = source;
		switch (type) {
			case SourceType.FOLDER: {
				const { path, includeSubfolders } =
					source as ObsidianFolderSource;
				const result = findRowsFromFolder(
					app,
					nextColumns,
					numRows + newRows.length,
					id,
					{
						path,
						includeSubfolders,
					}
				);
				newRows.push(...result.newRows);
				nextColumns = result.nextColumns;
				break;
			}
			default:
				throw new Error(`Source type not handled: ${type}`);
		}
	});
	return {
		newRows,
		nextColumns,
	};
}

const findRowsFromFolder = (
	app: App,
	columns: Column[],
	numRows: number,
	sourceId: string,
	folderOptions: {
		path: string;
		includeSubfolders: boolean;
	}
): {
	newRows: Row[];
	nextColumns: Column[];
} => {
	const { path, includeSubfolders } = folderOptions;
	const folder = app.vault.getAbstractFileByPath(path);
	if (!folder)
		return {
			nextColumns: columns,
			newRows: [],
		};

	const files = app.vault.getMarkdownFiles().filter((file) => {
		if (includeSubfolders) {
			return file.parent?.path.startsWith(folder.path);
		}
		return file.parent?.path === folder.path;
	});

	const newRows: Row[] = [];
	const nextColumns = cloneDeep(columns);

	files.forEach((file) => {
		const cells: Cell[] = [];

		nextColumns.forEach((column) => {
			const { path } = file;
			const { id, type, frontmatterKey } = column;

			let newCell: Cell | null = null;
			if (type === CellType.SOURCE_FILE) {
				newCell = createCell(id, { type, content: path });
			} else if (frontmatterKey !== null) {
				const result = deserializeFrontmatterForCell(app, column, path);
				if (result !== null) {
					const { newCell: cell, nextTags } = result;
					newCell = cell;
					column.tags = nextTags;
				}
			}

			if (newCell === null) newCell = createCell(id, { type });
			cells.push(newCell);
		});

		const row = createRow(numRows, {
			cells,
			sourceId,
			creationDateTime: new Date(file.stat.ctime).toISOString(),
			lastEditedDateTime: new Date(file.stat.mtime).toISOString(),
		});
		newRows.push(row);
	});

	return {
		newRows,
		nextColumns,
	};
};
