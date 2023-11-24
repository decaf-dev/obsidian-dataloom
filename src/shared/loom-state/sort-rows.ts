import CellNotFoundError from "src/shared/error/cell-not-found-error";
import TagNotFoundError from "src/shared/error/tag-not-found-error";
import {
	Cell,
	Row,
	CellType,
	Column,
	SortDir,
	LoomState,
	Tag,
	Source,
	DateCell,
	CheckboxCell,
	NumberCell,
	TextCell,
	FileCell,
	EmbedCell,
	SourceFileCell,
	TagCell,
	MultiTagCell,
} from "./types/loom-state";
import { getSourceCellContent } from "src/shared/cell-content/source-cell-content";
import {
	forceEmptyNumberCellsToBottom,
	sortByBoolean,
	sortByNumber,
	sortByText,
} from "src/shared/sort-utils";
import { isRelativePath } from "src/shared/link-and-path/link-predicates";
import { getFileName } from "../link-and-path/file-path-utils";

export const sortRows = (prevState: LoomState): LoomState => {
	const { columns, rows, sources } = prevState.model;
	const sortedColumns = columns.filter(
		(columns) => columns.sortDir !== SortDir.NONE
	);

	let newRows = [...rows];

	if (sortedColumns.length !== 0) {
		newRows = multiSort(sources, sortedColumns, rows);
	} else {
		newRows = sortByIndex(rows);
	}

	const nextState = {
		...prevState,
		model: {
			...prevState.model,
			rows: newRows,
		},
	};
	return nextState;
};

const multiSort = (sources: Source[], sortedColumns: Column[], rows: Row[]) => {
	const rowsCopy = [...rows];
	rowsCopy.sort((a, b) => {
		for (const column of sortedColumns) {
			const cellA = a.cells.find((cell) => cell.columnId === column.id);
			if (!cellA)
				throw new CellNotFoundError({
					columnId: column.id,
					rowId: a.id,
				});

			const cellB = b.cells.find((cell) => cell.columnId === column.id);
			if (!cellB)
				throw new CellNotFoundError({
					columnId: column.id,
					rowId: b.id,
				});

			const sourceA =
				sources.find((source) => source.id === a.sourceId) ?? null;
			const sourceB =
				sources.find((source) => source.id === b.sourceId) ?? null;

			const comparison = sortByColumn(
				a,
				b,
				cellA,
				cellB,
				sourceA,
				sourceB,
				column
			);
			if (comparison !== 0) {
				return comparison;
			}
		}
		return 0;
	});
	return rowsCopy;
};

const sortByIndex = (rows: Row[]): Row[] => {
	const rowsCopy = [...rows];
	rowsCopy.sort((a, b) => {
		return a.index - b.index;
	});
	return rowsCopy;
};

const sortByColumn = (
	rowA: Row,
	rowB: Row,
	cellA: Cell,
	cellB: Cell,
	sourceA: Source | null,
	sourceB: Source | null,
	column: Column
): number => {
	const { type, sortDir, tags } = column;
	if (type === CellType.NUMBER) {
		return sortByNumberCell(
			cellA as NumberCell,
			cellB as NumberCell,
			sortDir
		);
	} else if (type === CellType.MULTI_TAG) {
		return sortByMultiTag(
			cellA as MultiTagCell,
			cellB as MultiTagCell,
			tags,
			sortDir
		);
	} else if (type === CellType.TAG) {
		return sortByTag(cellA as TagCell, cellB as TagCell, tags, sortDir);
	} else if (type === CellType.DATE) {
		return sortByDateCell(cellA as DateCell, cellB as DateCell, sortDir);
	} else if (type === CellType.LAST_EDITED_TIME) {
		return sortByLastEditedTimeCell(rowA, rowA, sortDir);
	} else if (type === CellType.CREATION_TIME) {
		return sortByCreationTimeCell(rowB, rowB, sortDir);
	} else if (type === CellType.CHECKBOX) {
		return sortByCheckboxCell(
			cellA as CheckboxCell,
			cellB as CheckboxCell,
			sortDir
		);
	} else if (type === CellType.SOURCE_FILE) {
		return sortBySourceFileCell(
			cellA as SourceFileCell,
			cellB as SourceFileCell,
			sortDir
		);
	} else if (type === CellType.SOURCE) {
		return sortBySourceCell(sourceA, sourceB, sortDir);
	} else if (type === CellType.TEXT) {
		return sortByTextCell(cellA as TextCell, cellB as TextCell, sortDir);
	} else if (type === CellType.FILE) {
		return sortByFileCell(cellA as FileCell, cellB as FileCell, sortDir);
	} else if (type === CellType.EMBED) {
		return sortByEmbedCell(cellA as EmbedCell, cellB as EmbedCell, sortDir);
	} else {
		throw new Error("Unhandled cell type");
	}
};

const sortBySourceCell = (
	a: Source | null,
	b: Source | null,
	sortDir: SortDir
): number => {
	//Use empty instead of internal to force the empty cells to the bottom
	const contentA = a ? getSourceCellContent(a) : "";
	const contentB = b ? getSourceCellContent(b) : "";

	return sortByText(contentA, contentB, sortDir, false);
};

const sortBySourceFileCell = (
	a: SourceFileCell,
	b: SourceFileCell,
	sortDir: SortDir
): number => {
	const { path: pathA } = a;
	const { path: pathB } = b;

	const contentA = getFileName(pathA);
	const contentB = getFileName(pathB);

	return sortByText(contentA, contentB, sortDir, false);
};

const sortByTextCell = (a: TextCell, b: TextCell, sortDir: SortDir): number => {
	const { content: contentA } = a;
	const { content: contentB } = b;
	return sortByText(contentA, contentB, sortDir);
};

const sortByFileCell = (a: FileCell, b: FileCell, sortDir: SortDir): number => {
	const { path: pathA } = a;
	const { path: pathB } = b;

	const contentA = getFileName(pathA);
	const contentB = getFileName(pathB);
	return sortByText(contentA, contentB, sortDir);
};

const sortByEmbedCell = (
	a: EmbedCell,
	b: EmbedCell,
	sortDir: SortDir
): number => {
	const { pathOrUrl: pathOrUrlA } = a;
	const { pathOrUrl: pathOrUrlB } = b;

	let contentA = pathOrUrlA;
	if (isRelativePath(pathOrUrlA)) {
		contentA = getFileName(pathOrUrlA);
	}

	let contentB = pathOrUrlB;
	if (isRelativePath(pathOrUrlB)) {
		contentB = getFileName(pathOrUrlB);
	}
	return sortByText(contentA, contentB, sortDir);
};

const sortByNumberCell = (
	a: NumberCell,
	b: NumberCell,
	sortDir: SortDir
): number => {
	const { value: valueA } = a;
	const { value: valueB } = b;

	const result = forceEmptyNumberCellsToBottom(valueA, valueB);
	if (result !== null) {
		return result;
	}

	return sortByNumber(valueA as number, valueB as number, sortDir);
};

const sortByMultiTag = (
	cellA: MultiTagCell,
	cellB: MultiTagCell,
	columnTags: Tag[],
	sortDir: SortDir
): number => {
	//Force empty cells to the bottom
	if (cellA.tagIds.length === 0 && cellB.tagIds.length > 0) return 1;
	if (cellA.tagIds.length > 0 && cellB.tagIds.length === 0) return -1;
	if (cellA.tagIds.length === 0 && cellB.tagIds.length === 0) return 0;

	let tagLength = cellA.tagIds.length;
	if (cellB.tagIds.length > cellA.tagIds.length) {
		tagLength = cellB.tagIds.length;
	}

	for (let i = 0; i < tagLength; i++) {
		const tagIdA: string | undefined = cellA.tagIds[i];
		if (tagIdA === undefined) return -1;
		const tagA = columnTags.find((t) => t.id === tagIdA);
		if (!tagA) throw new TagNotFoundError(tagIdA);

		const tagIdB: string | undefined = cellB.tagIds[i];
		if (tagIdB === undefined) return 1;
		const tagB = columnTags.find((t) => t.id === tagIdB);
		if (!tagB) throw new TagNotFoundError(tagIdA);

		if (sortDir === SortDir.ASC) {
			const result = tagA.content.localeCompare(tagB.content);
			if (result !== 0) return result;
		} else if (sortDir === SortDir.DESC) {
			const result = tagB.content.localeCompare(tagA.content);
			if (result !== 0) return result;
		}
	}
	//If we got here, that means the cells have the exact same tags
	return 0;
};

const sortByTag = (
	cellA: TagCell,
	cellB: TagCell,
	columnTags: Tag[],
	sortDir: SortDir
): number => {
	const { tagId: tagIdA } = cellA;
	const { tagId: tagIdB } = cellB;
	//Force empty cells to the bottom
	if (tagIdA === null && tagIdB !== null) return 1;
	if (tagIdA !== null && tagIdB == null) return -1;
	if (tagIdA === null && tagIdB === null) return 0;

	const tagA = columnTags.find((t) => t.id === tagIdA);
	if (!tagA) throw new TagNotFoundError(tagIdA as string);

	const tagB = columnTags.find((t) => t.id === tagIdB);
	if (!tagB) throw new TagNotFoundError(tagIdB as string);

	if (sortDir === SortDir.ASC) {
		const result = tagA.content.localeCompare(tagB.content);
		if (result !== 0) return result;
	} else if (sortDir === SortDir.DESC) {
		const result = tagB.content.localeCompare(tagA.content);
		if (result !== 0) return result;
	}
	//If we got here, that means the cells have the exact same tags
	return 0;
};

const sortByCheckboxCell = (
	a: CheckboxCell,
	b: CheckboxCell,
	sortDir: SortDir
): number => {
	const { value: valueA } = a;
	const { value: valueB } = b;
	return sortByBoolean(valueA, valueB, sortDir);
};

const sortByDateCell = (a: DateCell, b: DateCell, sortDir: SortDir): number => {
	const dateTimeA = a.dateTime ? new Date(a.dateTime).getTime() : 0;
	const dateTimeB = b.dateTime ? new Date(b.dateTime).getTime() : 0;
	return sortByNumber(dateTimeA, dateTimeB, sortDir);
};

const sortByCreationTimeCell = (a: Row, b: Row, sortDir: SortDir): number => {
	const creationTimeA = new Date(a.creationDateTime).getTime();
	const creationTimeB = new Date(b.creationDateTime).getTime();
	return sortByNumber(creationTimeA, creationTimeB, sortDir);
};

const sortByLastEditedTimeCell = (a: Row, b: Row, sortDir: SortDir): number => {
	const creationTimeA = new Date(a.lastEditedDateTime).getTime();
	const creationTimeB = new Date(b.lastEditedDateTime).getTime();
	return sortByNumber(creationTimeA, creationTimeB, sortDir);
};
