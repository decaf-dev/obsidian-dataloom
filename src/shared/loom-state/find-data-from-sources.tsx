import { App, TFile } from "obsidian";
import {
	createCellForType,
	createRow,
	createSourceFileCell,
} from "./loom-state-factory";
import {
	Cell,
	CellType,
	Column,
	ObsidianFolderSource,
	ObsidianFrontmatterSource,
	Row,
	Source,
	SourceType,
} from "./types/loom-state";

import { deserializeFrontmatterForCell } from "../frontmatter";
import { cloneDeep } from "lodash";
import { getDateTimeFromUnixTime } from "../date/utils";

export default function updateStateFromSources(
	app: App,
	sources: Source[],
	columns: Column[],
	numRows: number
): {
	newRows: Row[];
	nextColumns: Column[];
} {
	const sourceFileMap: Map<TFile, string> = new Map();

	sources.forEach((source) => {
		const { id, type } = source;

		let sourceFiles = [];
		switch (type) {
			case SourceType.FOLDER: {
				sourceFiles = findRowsFromFolderSource(
					app,
					source as ObsidianFolderSource
				);
				break;
			}
			case SourceType.FRONTMATTER:
				sourceFiles = findRowsFromFrontmatterSource(app, source);
				break;
			default:
				throw new Error(`Source type not handled: ${type}`);
		}
		sourceFiles.forEach((file) => {
			sourceFileMap.set(file, id);
		});
	});

	const newRows: Row[] = [];
	let nextColumns: Column[] = cloneDeep(columns);

	const uniqueMap: Map<TFile, string> = new Map();
	const seenValues: Set<string> = new Set();

	sourceFileMap.forEach((value, key) => {
		const { path } = key;
		if (!seenValues.has(path)) {
			seenValues.add(path);
			uniqueMap.set(key, value);
		}
	});

	uniqueMap.forEach((sourceId, file) => {
		const cells: Cell[] = [];

		nextColumns.forEach((column) => {
			const { path } = file;
			const { id, type, frontmatterKey } = column;

			let newCell: Cell | null = null;
			if (type === CellType.SOURCE_FILE) {
				newCell = createSourceFileCell(id, { path });
			} else if (frontmatterKey !== null) {
				const result = deserializeFrontmatterForCell(app, column, path);
				if (result !== null) {
					const { newCell: cell, nextTags, includeTime } = result;
					newCell = cell;
					if (nextTags) column.tags = nextTags;
					if (includeTime) column.includeTime = true;
				}
			}

			if (newCell === null) newCell = createCellForType(id, type);
			cells.push(newCell);
		});

		const row = createRow(numRows + newRows.length, {
			cells,
			sourceId,
			creationDateTime: getDateTimeFromUnixTime(file.stat.ctime),
			lastEditedDateTime: getDateTimeFromUnixTime(file.stat.mtime),
		});
		newRows.push(row);
	});

	return {
		newRows,
		nextColumns,
	};
}

const findRowsFromFolderSource = (
	app: App,
	source: ObsidianFolderSource
): TFile[] => {
	const { path, includeSubfolders } = source;
	const folder = app.vault.getAbstractFileByPath(path);
	if (!folder) return [];

	const files = app.vault.getMarkdownFiles().filter((file) => {
		if (includeSubfolders) {
			return file.parent?.path.startsWith(folder.path);
		}
		return file.parent?.path === folder.path;
	});

	return files;
};

const findRowsFromFrontmatterSource = (
	app: App,
	source: ObsidianFrontmatterSource
): TFile[] => {
	const { propertyKey } = source;

	const files = app.vault.getMarkdownFiles().filter((file) => {
		const { path } = file;
		const fileMetadata = app.metadataCache.getCache(path);
		if (!fileMetadata) return false;

		const frontmatter = fileMetadata.frontmatter;
		if (!frontmatter) return false;

		if (frontmatter.hasOwnProperty(propertyKey)) return true;
	});
	return files;
};
