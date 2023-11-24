import {
	Cell,
	Row,
	CellType,
	Filter,
	FilterCondition,
	LoomState,
	Tag,
	TextFilter,
	TagFilter,
	MultiTagFilter,
	FileFilter,
	TextFilterCondition,
	EmbedFilter,
	DateFilter,
	NumberFilter,
	NumberFilterCondition,
	CreationTimeFilter,
	LastEditedTimeFilter,
	DateFilterCondition,
	DateFilterOption,
	Column,
	SourceFileFilter,
	TextCell,
	FileCell,
	CheckboxCell,
	TagCell,
	MultiTagCell,
	NumberCell,
	DateCell,
	SourceFileCell,
	EmbedCell,
} from "src/shared/loom-state/types/loom-state";
import { Expression, evaluateWithPrecedence } from "./evaluate-with-precedence";
import {
	getDateAtMidnight,
	getDateFromDateFilterOption,
	getDateJustBeforeMidnight,
} from "./utils";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import { getFileName } from "src/shared/link-and-path/file-path-utils";
import { isRelativePath } from "src/shared/link-and-path/link-predicates";

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
			return doesTextMatch(content, text, condition);
		}
		case CellType.FILE: {
			const { alias, path } = cell as FileCell;
			const { text } = filter as FileFilter;
			return doesTextMatch(alias ?? path, text, condition);
		}
		case CellType.CHECKBOX: {
			const { value } = cell as CheckboxCell;
			return doesBooleanMatch(value, condition);
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
			return doesNumberMatch(value, text, condition);
		}
		case CellType.EMBED: {
			const { pathOrUrl } = cell as EmbedCell;
			const { text } = filter as EmbedFilter;

			let compareValue = pathOrUrl;
			if (isRelativePath(pathOrUrl)) {
				compareValue = getFileName(pathOrUrl);
			}
			return doesTextMatch(compareValue, text, condition);
		}
		case CellType.DATE: {
			const { dateTime: cellDateTime } = cell as DateCell;
			const { dateTime: filterDateTime, option } = filter as DateFilter;
			return doesDateMatch(
				cellDateTime,
				filterDateTime,
				option,
				condition
			);
		}
		case CellType.CREATION_TIME: {
			const { creationDateTime } = row;
			const { dateTime, option } = filter as CreationTimeFilter;
			return doesDateMatch(creationDateTime, dateTime, option, condition);
		}
		case CellType.LAST_EDITED_TIME: {
			const { lastEditedDateTime } = row;
			const { dateTime, option } = filter as LastEditedTimeFilter;
			return doesDateMatch(
				lastEditedDateTime,
				dateTime,
				option,
				condition
			);
		}

		case CellType.SOURCE_FILE: {
			const { text } = filter as SourceFileFilter;
			const { path } = cell as SourceFileCell;
			const fileName = getFileName(path);
			return doesTextMatch(fileName ?? "", text, condition);
		}

		default:
			throw new Error("Unhandled cell type");
	}
};

const doesBooleanMatch = (value: boolean, condition: FilterCondition) => {
	switch (condition) {
		case TextFilterCondition.IS:
			return value === true;
		case TextFilterCondition.IS_NOT:
			return value === false;
		default:
			throw new Error("Filter condition not yet supported");
	}
};

const doesNumberMatch = (
	cellValue: number | null,
	filterText: string,
	condition: FilterCondition
) => {
	const filterNumber = Number(filterText);
	switch (condition) {
		case NumberFilterCondition.IS_EQUAL:
			if (cellValue === null) return true;
			return cellValue === filterNumber;
		case NumberFilterCondition.IS_GREATER:
			if (cellValue === null) return true;
			return cellValue > filterNumber;
		case NumberFilterCondition.IS_GREATER_OR_EQUAL:
			if (cellValue === null) return true;
			return cellValue >= filterNumber;
		case NumberFilterCondition.IS_LESS:
			if (cellValue === null) return true;
			return cellValue < filterNumber;
		case NumberFilterCondition.IS_LESS_OR_EQUAL:
			if (cellValue === null) return true;
			return cellValue <= filterNumber;
		case NumberFilterCondition.IS_NOT_EQUAL:
			if (cellValue === null) return true;
			return cellValue !== filterNumber;
		case NumberFilterCondition.IS_EMPTY:
			return cellValue === null;
		case NumberFilterCondition.IS_NOT_EMPTY:
			return cellValue !== null;
		default:
			throw new Error("Filter condition not yet supported");
	}
};

const doesDateMatch = (
	cellDateTime: string | null,
	filterDateTime: string | null,
	option: DateFilterOption,
	condition: FilterCondition
) => {
	let cellDate: Date | null = null;
	if (cellDateTime !== null) {
		cellDate = new Date(cellDateTime);
	}

	let compareDate = getDateFromDateFilterOption(option);
	if (compareDate === null) {
		if (filterDateTime !== null) {
			compareDate = new Date(filterDateTime);
		}
	}

	switch (condition) {
		case DateFilterCondition.IS: {
			if (compareDate === null) return true;
			if (cellDate === null) return false;

			const compareDateMidnight = getDateAtMidnight(compareDate);
			const compareDateJustBeforeMidnight =
				getDateJustBeforeMidnight(compareDate);

			return (
				cellDate.getTime() >= compareDateMidnight.getTime() &&
				cellDate.getTime() <= compareDateJustBeforeMidnight.getTime()
			);
		}
		case DateFilterCondition.IS_AFTER: {
			if (compareDate === null) return true;
			if (cellDate === null) return false;
			const compareDateBeforeMidnight =
				getDateJustBeforeMidnight(compareDate);
			return cellDate.getTime() > compareDateBeforeMidnight.getTime();
		}
		case DateFilterCondition.IS_BEFORE: {
			if (compareDate === null) return true;
			if (cellDate === null) return false;

			const compareDateMidnight = getDateAtMidnight(compareDate);
			return cellDate.getTime() < compareDateMidnight.getTime();
		}
		case DateFilterCondition.IS_EMPTY:
			return cellDate === null;
		case DateFilterCondition.IS_NOT_EMPTY:
			return cellDate !== null;
		default:
			throw new Error("Filter condition not yet supported");
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

/**
 * Checks if the cell content matches the filter text based on the condition
 * @param cellContent - The content of the cell to be filtered
 * @param filterText - The text to filter by
 * @param condition - The condition by which to compare the cell content and filter text
 */
const doesTextMatch = (
	cellContent: string,
	filterText: string,
	condition: FilterCondition
): boolean => {
	cellContent = cellContent.toLowerCase().trim();
	filterText = filterText.toLowerCase().trim();

	switch (condition) {
		case TextFilterCondition.IS:
			if (filterText === "") return true;
			return cellContent === filterText;
		case TextFilterCondition.IS_NOT:
			if (filterText === "") return true;
			return cellContent !== filterText;
		case TextFilterCondition.CONTAINS:
			return cellContent.includes(filterText);
		case TextFilterCondition.DOES_NOT_CONTAIN:
			if (filterText === "") return true;
			return !cellContent.includes(filterText);
		case TextFilterCondition.STARTS_WITH:
			return cellContent.startsWith(filterText);
		case TextFilterCondition.ENDS_WITH:
			return cellContent.endsWith(filterText);
		case TextFilterCondition.IS_EMPTY:
			return cellContent === "";
		case TextFilterCondition.IS_NOT_EMPTY:
			return cellContent !== "";
		default:
			throw new Error("Filter condition not yet supported");
	}
};
