import {
	BodyCell,
	BodyRow,
	CellType,
	Filter,
	FilterCondition,
	LoomState,
	Tag,
	TextFilter,
	CheckboxFilter,
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
} from "src/shared/loom-state/types/loom-state";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import { Expression, evaluateWithPrecedence } from "./evaluate-with-precedence";
import {
	getDateAtMidnight,
	getDateFromDateFilterOption,
	getDateJustBeforeMidnight,
} from "./utils";

/**
 * Filters body rows by the filters array
 * @param prevState - The previous state of the loom
 */
export const filterByFilters = (prevState: LoomState): BodyRow[] => {
	const { columns, bodyCells, bodyRows, filters } = prevState.model;

	const cellMatches = new Map<string, boolean>();
	bodyCells.forEach((cell) => {
		const column = columns.find((column) => column.id === cell.columnId);
		if (!column) throw new ColumNotFoundError(cell.columnId);

		const row = bodyRows.find((row) => row.id === cell.rowId);
		if (!row) throw new Error("Row not found");

		const { tags, type } = column;
		const doesMatch = doesCellMatchFilters(cell, row, type, tags, filters);
		cellMatches.set(cell.id, doesMatch);
	});

	return bodyRows.filter((row: BodyRow) => {
		const filteredCells = bodyCells.filter((cell) => cell.rowId === row.id);
		return filteredCells.every((cell) => cellMatches.get(cell.id));
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
	cell: BodyCell,
	row: BodyRow,
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
	cell: BodyCell,
	row: BodyRow,
	cellType: CellType,
	columnTags: Tag[],
	filter: Filter
): boolean | null => {
	const { columnId, isEnabled, condition } = filter;
	if (columnId !== cell.columnId) return null;
	if (!isEnabled) return null;

	switch (cellType) {
		case CellType.TEXT: {
			const { text } = filter as TextFilter;
			return doesTextMatch(cell.markdown, text, condition);
		}
		case CellType.FILE: {
			const { text } = filter as FileFilter;
			return doesTextMatch(cell.markdown, text, condition);
		}
		case CellType.CHECKBOX: {
			const { text } = filter as CheckboxFilter;
			return doesTextMatch(cell.markdown, text, condition);
		}
		case CellType.TAG: {
			const { tagId } = filter as TagFilter;
			const filterTag =
				columnTags.find((tag) => tagId === tag.id) ?? null;
			const cellTag =
				columnTags.find((tag) => cell.tagIds.includes(tag.id)) ?? null;
			return doesTagMatch(cellTag, filterTag, condition);
		}
		case CellType.MULTI_TAG: {
			const { tagIds } = filter as MultiTagFilter;
			const filterTags = columnTags.filter((tag) =>
				tagIds.includes(tag.id)
			);
			const cellTags = columnTags.filter((tag) =>
				cell.tagIds.includes(tag.id)
			);
			return doTagsMatch(cellTags, filterTags, condition);
		}
		case CellType.NUMBER: {
			const { text } = filter as NumberFilter;
			return doesNumberMatch(cell.markdown, text, condition);
		}
		case CellType.EMBED: {
			const { text } = filter as EmbedFilter;
			return doesTextMatch(cell.markdown, text, condition);
		}
		case CellType.DATE: {
			const { dateTime, option } = filter as DateFilter;
			return doesDateMatch(cell.dateTime, dateTime, option, condition);
		}
		case CellType.CREATION_TIME: {
			const { creationTime } = row;
			const { dateTime, option } = filter as CreationTimeFilter;
			return doesDateMatch(creationTime, dateTime, option, condition);
		}
		case CellType.LAST_EDITED_TIME: {
			const { lastEditedTime } = row;
			const { dateTime, option } = filter as LastEditedTimeFilter;
			return doesDateMatch(lastEditedTime, dateTime, option, condition);
		}

		default:
			throw new Error("Cell type not yet supported");
	}
};

const doesNumberMatch = (
	cellContent: string,
	filterText: string,
	condition: FilterCondition
) => {
	const cellNumber = Number(cellContent);
	const filterNumber = Number(filterText);
	switch (condition) {
		case NumberFilterCondition.IS_EQUAL:
			if (cellContent === "") return true;
			return cellNumber === filterNumber;
		case NumberFilterCondition.IS_GREATER:
			if (cellContent === "") return true;
			return cellNumber > filterNumber;
		case NumberFilterCondition.IS_GREATER_OR_EQUAL:
			if (cellContent === "") return true;
			return cellNumber >= filterNumber;
		case NumberFilterCondition.IS_LESS:
			if (cellContent === "") return true;
			return cellNumber < filterNumber;
		case NumberFilterCondition.IS_LESS_OR_EQUAL:
			if (cellContent === "") return true;
			return cellNumber <= filterNumber;
		case NumberFilterCondition.IS_NOT_EQUAL:
			if (cellContent === "") return true;
			return cellNumber !== filterNumber;
		case NumberFilterCondition.IS_EMPTY:
			return cellContent === "";
		case NumberFilterCondition.IS_NOT_EMPTY:
			return cellContent !== "";
		default:
			throw new Error("Filter condition not yet supported");
	}
};

const doesDateMatch = (
	cellDateTime: number | null,
	filterDateTime: number | null,
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
