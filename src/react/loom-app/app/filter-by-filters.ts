import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	Filter,
	FilterCondition,
	LoomState,
	Tag,
	TextFilter,
	CheckboxFilter,
	TagFilter,
	MultiTagFilter,
} from "src/shared/loom-state/types";
import ColumNotFoundError from "src/shared/error/column-not-found-error";

export const filterByFilters = (prevState: LoomState): BodyRow[] => {
	const { columns, bodyCells, bodyRows, filters } = prevState.model;
	//Map column id to column instance
	const columnMap = new Map<string, Column>();
	columns.forEach((column) => columnMap.set(column.id, column));

	//Whether or not the cells matches the filters
	const cellMatches = new Map<string, boolean>();

	//Iterate over all cells and set whether they match the filter set
	bodyCells.forEach((cell) => {
		const column = columnMap.get(cell.columnId);
		if (!column) throw new ColumNotFoundError(cell.columnId);

		const { tags } = column;

		const doesMatch = doesCellMatchFilters(
			cell,
			column.type,
			tags,
			filters
		);
		cellMatches.set(cell.id, doesMatch);
	});

	//Now filter the rows based on whether all of their cells match the filterset
	return bodyRows.filter((row: BodyRow) => {
		const filteredCells = bodyCells.filter((cell) => cell.rowId === row.id);
		return filteredCells.every((cell) => cellMatches.get(cell.id) === true);
	});
};

const doesCellMatchFilters = (
	cell: BodyCell,
	cellType: CellType,
	columnTags: Tag[],
	filters: Filter[]
) => {
	return filters.every((filter) =>
		doesCellMatchFilter(cell, cellType, columnTags, filter)
	);
};

const doesCellMatchFilter = (
	cell: BodyCell,
	cellType: CellType,
	columnTags: Tag[],
	filter: Filter
) => {
	const { columnId, isEnabled, condition } = filter;
	if (columnId !== cell.columnId) return true;
	if (!isEnabled) return true;

	switch (cellType) {
		case CellType.TEXT:
		case CellType.FILE: {
			const { text } = filter as TextFilter;
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
	}
};

const doesTagMatch = (
	cellTag: Tag | null,
	filterTag: Tag | null,
	condition: FilterCondition
) => {
	switch (condition) {
		case FilterCondition.IS:
			if (filterTag === null) return true;
			return cellTag?.id == filterTag?.id;
		case FilterCondition.IS_NOT:
			if (filterTag === null) return true;
			return cellTag?.id !== filterTag?.id;
		case FilterCondition.IS_EMPTY:
			return cellTag === null;
		case FilterCondition.IS_NOT_EMPTY:
			return cellTag !== null;
		default:
			throw new Error("Filter condition not yet supported");
	}
};

const doTagsMatch = (
	cellTags: Tag[],
	filterTags: Tag[],
	condition: FilterCondition
) => {
	switch (condition) {
		case FilterCondition.CONTAINS:
			return filterTags.every((filterTag) =>
				cellTags.some((cellTag) => cellTag.id === filterTag.id)
			);
		case FilterCondition.DOES_NOT_CONTAIN:
			return filterTags.every((filterTag) =>
				cellTags.every((cellTag) => cellTag.id !== filterTag.id)
			);
		case FilterCondition.IS_EMPTY:
			return cellTags.length === 0;
		case FilterCondition.IS_NOT_EMPTY:
			return cellTags.length !== 0;
		default:
			throw new Error("Filter condition not yet supported");
	}
};

const doesTextMatch = (
	cellContent: string,
	filterText: string,
	condition: FilterCondition
) => {
	cellContent = cellContent.toLowerCase().trim();
	filterText = filterText.toLowerCase().trim();

	switch (condition) {
		case FilterCondition.IS:
			return cellContent === filterText;
		case FilterCondition.IS_NOT:
			return cellContent !== filterText;
		case FilterCondition.CONTAINS:
			return cellContent.includes(filterText);
		case FilterCondition.DOES_NOT_CONTAIN:
			return !cellContent.includes(filterText);
		case FilterCondition.STARTS_WITH:
			return cellContent.startsWith(filterText);
		case FilterCondition.ENDS_WITH:
			return cellContent.endsWith(filterText);
		case FilterCondition.IS_EMPTY:
			return cellContent === "";
		case FilterCondition.IS_NOT_EMPTY:
			return cellContent !== "";
		default:
			throw new Error("Filter condition not yet supported");
	}
};
