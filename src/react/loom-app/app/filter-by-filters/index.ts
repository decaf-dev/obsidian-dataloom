import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import {
	doesBooleanMatchFilter,
	doesDateMatchFilter,
	doesNumberMatchFilter,
	doesTextMatchFilter,
} from "src/shared/filter/filter-match";
import { getFileName } from "src/shared/link-and-path/file-path-utils";
import { isRelativePath } from "src/shared/link-and-path/link-predicates";
import {
	type Cell,
	CellType,
	type CheckboxCell,
	type CheckboxFilter,
	type Column,
	type CreationTimeFilter,
	type DateCell,
	type DateFilter,
	type EmbedCell,
	type EmbedFilter,
	type FileCell,
	type FileFilter,
	type Filter,
	type FilterCondition,
	type LastEditedTimeFilter,
	type LoomState,
	type MultiTagCell,
	type MultiTagFilter,
	type NumberCell,
	type NumberFilter,
	type Row,
	type SourceFileCell,
	type SourceFileFilter,
	type Tag,
	type TagCell,
	type TagFilter,
	type TextCell,
	type TextFilter,
	TextFilterCondition,
} from "src/shared/loom-state/types/loom-state";
import {
	type Expression,
	evaluateWithPrecedence,
} from "./evaluate-with-precedence";

/**
 * Filters body rows by the filters array
 * @param prevState - The previous state of the loom
 */
export const filterByFilters = (prevState: LoomState): Row[] => {
	const { columns, rows, filters } = prevState.model;

	const columnIdToColumn = new Map<string, Column>();
	columns.forEach((column) => {
		columnIdToColumn.set(column.id, column);
	});

	const cellIdToColumn = new Map<string, Column>();
	rows.forEach((row) => {
		const { cells } = row;
		cells.forEach((cell) => {
			const column = columnIdToColumn.get(cell.columnId);
			if (!column) throw new ColumnNotFoundError({ id: cell.columnId });
			cellIdToColumn.set(cell.id, column);
		});
	});

	return rows.filter((row: Row) => {
		const { cells } = row;
		return cells.every((cell) => {
			const column = cellIdToColumn.get(cell.id);
			if (!column) throw new ColumnNotFoundError({ id: cell.columnId });
			const { type, tags } = column;
			return doesCellMatchFilters(cell, row, type, tags, filters);
		});
	});
};

/**
 * Checks if the cell matches the filters
 * If a filter doesn't apply to a cell, the filter is ignored in the evaluation.
 * If no filters apply to a cell, the cell is considered to be matching.
 * @param cell - The cell to be filtered
 * @param cellType - The type of the cell to be filtered
 * @param columnTags - The tags of the column of the cell to be filtered
 * @param filters - The filters to apply to the cell
 */
const doesCellMatchFilters = (
	cell: Cell,
	row: Row,
	cellType: CellType,
	columnTags: Tag[],
	filters: Filter[]
) => {
	const expressions = filters
		.map((filter) => ({
			operator: filter.operator,
			value: doesCellMatchFilter(cell, row, cellType, columnTags, filter),
		}))
		.filter((expression) => expression.value !== null) as Expression[];
	if (expressions.length === 0) return true;

	return evaluateWithPrecedence(expressions);
};

/**
 * Checks if the cell matches the filter based on the condition
 * @param cell - The cell to be filtered
 * @param cellType - The type of the cell to be filtered
 * @param columnTags - The tags of the column of the cell to be filtered
 * @param filter - The filter to apply to the cell
 * @returns true if the cell matches the filter, false if it does not, null if the filter does not apply to the cell
 */
const doesCellMatchFilter = (
	cell: Cell,
	row: Row,
	cellType: CellType,
	columnTags: Tag[],
	filter: Filter
): boolean | null => {
	const { columnId, isEnabled, condition } = filter;
	if (columnId !== cell.columnId) return null;
	if (!isEnabled) return null;

	switch (cellType) {
		case CellType.TEXT: {
			const { content } = cell as TextCell;
			const { text } = filter as TextFilter;
			return doesTextMatchFilter(content, condition, text, true);
		}
		case CellType.FILE: {
			const { alias, path } = cell as FileCell;
			const { text } = filter as FileFilter;
			return doesTextMatchFilter(alias ?? path, condition, text, true);
		}
		case CellType.CHECKBOX: {
			const { value } = cell as CheckboxCell;
			const { value: filterValue } = filter as CheckboxFilter;
			return doesBooleanMatchFilter(value, condition, filterValue);
		}
		case CellType.TAG: {
			const { tagId: cellTagId } = cell as TagCell;
			const { tagId: filterTagId } = filter as TagFilter;
			const filterTag =
				columnTags.find((tag) => filterTagId === tag.id) ?? null;
			const cellTag =
				columnTags.find((tag) => cellTagId === tag.id) ?? null;
			return doesTagMatch(cellTag, filterTag, condition);
		}
		case CellType.MULTI_TAG: {
			const { tagIds: cellTagIds } = cell as MultiTagCell;
			const { tagIds: filterTagIds } = filter as MultiTagFilter;
			const filterTags = columnTags.filter((tag) =>
				filterTagIds.includes(tag.id)
			);
			const cellTags = columnTags.filter((tag) =>
				cellTagIds.includes(tag.id)
			);
			return doTagsMatch(cellTags, filterTags, condition);
		}
		case CellType.NUMBER: {
			const { value } = cell as NumberCell;
			const { text } = filter as NumberFilter;
			return doesNumberMatchFilter(value, condition, text, true);
		}
		case CellType.EMBED: {
			const { pathOrUrl } = cell as EmbedCell;
			const { text } = filter as EmbedFilter;

			let compareValue = pathOrUrl;
			if (isRelativePath(pathOrUrl)) {
				compareValue = getFileName(pathOrUrl);
			}
			return doesTextMatchFilter(compareValue, condition, text, true);
		}
		case CellType.DATE: {
			const { dateTime: cellDateTime } = cell as DateCell;
			const { dateTime: filterDateTime, option } = filter as DateFilter;
			return doesDateMatchFilter(
				cellDateTime,
				condition,
				option,
				filterDateTime,
				true
			);
		}
		case CellType.CREATION_TIME: {
			const { creationDateTime } = row;
			const { dateTime, option } = filter as CreationTimeFilter;
			return doesDateMatchFilter(
				creationDateTime,
				condition,
				option,
				dateTime,
				true
			);
		}
		case CellType.LAST_EDITED_TIME: {
			const { lastEditedDateTime } = row;
			const { dateTime, option } = filter as LastEditedTimeFilter;
			return doesDateMatchFilter(
				lastEditedDateTime,
				condition,
				option,
				dateTime,
				true
			);
		}

		case CellType.SOURCE_FILE: {
			const { text } = filter as SourceFileFilter;
			const { path } = cell as SourceFileCell;
			const fileName = getFileName(path);
			return doesTextMatchFilter(fileName ?? "", condition, text, true);
		}

		default:
			throw new Error("Unhandled cell type");
	}
};

/**
 * Checks if the cell tag matches the filter tag based on the condition
 * @param cellTag - The tag of the cell to be filtered
 * @param filterTag - The tag to filter by
 * @param condition - The condition by which to compare the cell tag and filter tag
 * @returns
 */
const doesTagMatch = (
	cellTag: Tag | null,
	filterTag: Tag | null,
	condition: FilterCondition
): boolean => {
	switch (condition) {
		case TextFilterCondition.IS:
			if (filterTag === null) return true;
			return cellTag?.id == filterTag.id;
		case TextFilterCondition.IS_NOT:
			if (filterTag === null) return true;
			return cellTag?.id !== filterTag.id;
		case TextFilterCondition.IS_EMPTY:
			return cellTag === null;
		case TextFilterCondition.IS_NOT_EMPTY:
			return cellTag !== null;
		default:
			throw new Error("Filter condition not yet supported");
	}
};

/**
 * Checks if the cell tags match the filter tags based on the condition
 * @param cellTags - The tags of the cell to be filtered
 * @param filterTags - The text to filter by
 * @param condition - The condition by which to compare the cell tags and filter tags
 */
const doTagsMatch = (
	cellTags: Tag[],
	filterTags: Tag[],
	condition: FilterCondition
): boolean => {
	switch (condition) {
		case TextFilterCondition.CONTAINS:
			//Union
			return filterTags.every((filterTag) =>
				cellTags.some((cellTag) => cellTag.id === filterTag.id)
			);
		case TextFilterCondition.DOES_NOT_CONTAIN:
			//Complement
			return filterTags.every((filterTag) =>
				cellTags.every((cellTag) => cellTag.id !== filterTag.id)
			);
		case TextFilterCondition.IS_EMPTY:
			return cellTags.length === 0;
		case TextFilterCondition.IS_NOT_EMPTY:
			return cellTags.length !== 0;
		default:
			throw new Error("Filter condition not yet supported");
	}
};
