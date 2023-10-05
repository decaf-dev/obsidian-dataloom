import { App } from "obsidian";
import { createCell, createRow } from "./loom-state-factory";
import {
	Cell,
	CellType,
	Column,
	Row,
	Source,
	SourceType,
} from "./types/loom-state";
import { parseContentFromFrontMatter } from "./parse-content-from-frontmatter";
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
		const { id, type, content } = source;
		switch (type) {
			case SourceType.FOLDER: {
				const result = findRowsFromFolder(
					app,
					nextColumns,
					id,
					content,
					numRows + newRows.length
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
	sourceId: string,
	folderName: string,
	numRows: number
): {
	newRows: Row[];
	nextColumns: Column[];
} => {
	const folder = app.vault.getAbstractFileByPath(folderName);
	if (!folder)
		return {
			nextColumns: columns,
			newRows: [],
		};

	const files = app.vault
		.getMarkdownFiles()
		.filter((file) => file.parent?.path === folder.path);

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
				const frontmatter: string | string[] | null =
					app.metadataCache.getCache(path)?.frontmatter?.[
						frontmatterKey.value
					] ?? null;
				if (frontmatter !== null) {
					const result = parseContentFromFrontMatter(
						column,
						type,
						frontmatter
					);
					if (result !== null) {
						const { newCell: cell, nextTags } = result;
						newCell = cell;
						column.tags = nextTags;
					}
				}
			}

			if (newCell === null) newCell = createCell(id, { type });
			cells.push(newCell);
		});

		const row = createRow(numRows, {
			cells,
			sourceId,
			creationTime: file.stat.ctime,
			lastEditedTime: file.stat.mtime,
		});
		newRows.push(row);
	});

	return {
		newRows,
		nextColumns,
	};
};
