import { App, TFile } from "obsidian";
import {
	createCellForType,
	createRow,
	createSourceFileCell,
} from "./loom-state-factory";
import {
	type Cell,
	CellType,
	type Column,
	DateFilterOption,
	type FilterCondition,
	type ObsidianFolderSource,
	type ObsidianFrontmatterSource,
	type Row,
	type Source,
	SourceType,
	TextFilterCondition,
} from "./types/loom-state";

import { cloneDeep } from "lodash";
import { getDateTimeFromUnixTime } from "../date/utils";
import {
	doesBooleanMatchFilter,
	doesDateMatchFilter,
	doesNumberMatchFilter,
	doesTextMatchFilter,
} from "../filter/filter-match";
import { deserializeFrontmatterForCell } from "../frontmatter";
import { ObsidianPropertyType } from "../frontmatter/types";

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
	const nextColumns: Column[] = cloneDeep(columns);

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
	const { propertyKey, propertyType, filterCondition, filterText } = source;

	const files = app.vault.getMarkdownFiles().filter((file) => {
		const { path } = file;
		const fileMetadata = app.metadataCache.getCache(path);
		if (!fileMetadata) return false;

		const frontmatter = fileMetadata.frontmatter;
		if (!frontmatter) return false;

		const propertyValue = frontmatter[propertyKey];
		if (propertyValue === undefined || propertyValue === null) return false;

		if (filterCondition === null) return false;
		if (
			!doesMatchFilterCondition(
				propertyType,
				propertyValue,
				filterCondition,
				filterText
			)
		)
			return false;
		return true;
	});
	return files;
};

const doesMatchFilterCondition = (
	propertyType: ObsidianPropertyType,
	propertyValue: string | boolean | number | string[],
	filterCondition: FilterCondition,
	filterText: string
): boolean => {
	switch (propertyType) {
		case ObsidianPropertyType.TEXT: {
			const value = propertyValue as string;
			return doesTextMatchFilter(
				value,
				filterCondition,
				filterText,
				false
			);
		}

		case ObsidianPropertyType.CHECKBOX: {
			const value = propertyValue as boolean;
			return doesBooleanMatchFilter(
				value,
				filterCondition,
				filterText === "true" ? true : false
			);
		}

		case ObsidianPropertyType.NUMBER: {
			const value = propertyValue as number;
			return doesNumberMatchFilter(
				value,
				filterCondition,
				filterText,
				false
			);
		}
		case ObsidianPropertyType.DATE:
		case ObsidianPropertyType.DATETIME: {
			const value = propertyValue as string;
			return doesDateMatchFilter(
				value,
				filterCondition,
				filterText as DateFilterOption,
				null,
				false
			);
		}
		case ObsidianPropertyType.ALIASES:
		case ObsidianPropertyType.TAGS:
		case ObsidianPropertyType.MULTITEXT: {
			const value = propertyValue as string[];
			return doesListMatchFilter(value, filterCondition, filterText);
		}
		default:
			return false;
	}
};

const doesListMatchFilter = (
	values: string[],
	condition: FilterCondition,
	filterText: string
): boolean => {
	const filterTextValues = filterText.split(",").map((text) => text.trim());
	switch (condition) {
		case TextFilterCondition.CONTAINS:
			return filterTextValues.every((v) => values.includes(v));
		case TextFilterCondition.DOES_NOT_CONTAIN:
			return filterTextValues.every((v) => !values.includes(v));
		case TextFilterCondition.IS_EMPTY:
			return values.length === 0;
		case TextFilterCondition.IS_NOT_EMPTY:
			return values.length !== 0;
		default:
			return false;
	}
};
