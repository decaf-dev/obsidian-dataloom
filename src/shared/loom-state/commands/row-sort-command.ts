import CellNotFoundError from "src/shared/error/cell-not-found-error";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import TagNotFoundError from "src/shared/error/tag-not-found-error";
import LoomStateCommand from "./loom-state-command";
import {
	Cell,
	Row,
	CellType,
	Column,
	SortDir,
	LoomState,
	Tag,
	Source,
} from "../types/loom-state";
import { isCheckboxChecked } from "../../match";
import { getSourceCellContent } from "src/shared/cell-content/source-cell-content";
import {
	forceEmptyCellsToBottom,
	sortByBoolean,
	sortByNumber,
	sortByText,
} from "src/shared/sort-utils";

export default class RowSortCommand extends LoomStateCommand {
	/**
	 * The previous row sort state
	 */
	private previousRowSort: {
		id: string;
		index: number;
	}[] = [];

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, rows, sources } = prevState.model;
		const sortedColumns = columns.filter(
			(columns) => columns.sortDir !== SortDir.NONE
		);

		this.previousRowSort = rows.map((row) => ({
			id: row.id,
			index: row.index,
		}));

		let newRows = [...rows];

		if (sortedColumns.length !== 0) {
			newRows = this.multiSort(sources, sortedColumns, rows);
		} else {
			newRows = this.sortByIndex(rows);
		}

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows } = prevState.model;
		const newRows = this.previousRowSort.map((prev) => {
			const row = rows.find((row) => row.id === prev.id);
			if (!row) throw new RowNotFoundError(prev.id);
			return {
				...row,
				index: prev.index,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
			},
		};
	}

	private multiSort = (
		sources: Source[],
		sortedColumns: Column[],
		rows: Row[]
	) => {
		const rowsCopy = [...rows];
		rowsCopy.sort((a, b) => {
			for (const column of sortedColumns) {
				const cellA = a.cells.find(
					(cell) => cell.columnId === column.id
				);
				if (!cellA)
					throw new CellNotFoundError({
						columnId: column.id,
						rowId: a.id,
					});

				const cellB = b.cells.find(
					(cell) => cell.columnId === column.id
				);
				if (!cellB)
					throw new CellNotFoundError({
						columnId: column.id,
						rowId: b.id,
					});

				const sourceA =
					sources.find((source) => source.id === a.sourceId) ?? null;
				const sourceB =
					sources.find((source) => source.id === b.sourceId) ?? null;

				const comparison = this.sortByColumn(
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

	private sortByIndex(rows: Row[]): Row[] {
		const rowsCopy = [...rows];
		rowsCopy.sort((a, b) => {
			return a.index - b.index;
		});
		return rowsCopy;
	}

	private sortByColumn(
		rowA: Row,
		rowB: Row,
		cellA: Cell,
		cellB: Cell,
		sourceA: Source | null,
		sourceB: Source | null,
		column: Column
	): number {
		const { type, sortDir, tags } = column;
		if (type === CellType.NUMBER) {
			return this.sortByNumberCell(cellA, cellB, sortDir);
		} else if (type === CellType.TAG || type === CellType.MULTI_TAG) {
			return this.sortByTag(cellA, cellB, tags, sortDir);
		} else if (type === CellType.DATE) {
			return this.sortByDateCell(cellA, cellB, sortDir);
		} else if (type === CellType.LAST_EDITED_TIME) {
			return this.sortByLastEditedTimeCell(rowA, rowA, sortDir);
		} else if (type === CellType.CREATION_TIME) {
			return this.sortByCreationTimeCell(rowB, rowB, sortDir);
		} else if (type === CellType.CHECKBOX) {
			return this.sortByCheckboxCell(cellA, cellB, sortDir);
		} else if (type === CellType.SOURCE_FILE) {
			return this.sortBySourceFileCell(cellA, cellB, sortDir);
		} else if (type === CellType.SOURCE) {
			return this.sortBySourceCell(sourceA, sourceB, sortDir);
		} else {
			return this.sortByTextCell(cellA, cellB, sortDir);
		}
	}

	private sortBySourceCell(
		a: Source | null,
		b: Source | null,
		sortDir: SortDir
	): number {
		//Use empty instead of internal to force the empty cells to the bottom
		const contentA = a ? getSourceCellContent(a) : "";
		const contentB = b ? getSourceCellContent(b) : "";

		return sortByText(contentA, contentB, sortDir, false);
	}

	private sortBySourceFileCell(a: Cell, b: Cell, sortDir: SortDir): number {
		const { content: contentA } = a;
		const { content: contentB } = b;
		return sortByText(contentA, contentB, sortDir, false);
	}

	private sortByTextCell(a: Cell, b: Cell, sortDir: SortDir): number {
		const { content: contentA } = a;
		const { content: contentB } = b;

		return sortByText(contentA, contentB, sortDir);
	}

	private sortByNumberCell(a: Cell, b: Cell, sortDir: SortDir): number {
		const { content: contentA } = a;
		const { content: contentB } = b;

		const result = forceEmptyCellsToBottom(contentA, contentB);
		if (result !== null) return result;

		const numberA = parseFloat(contentA);
		const numberB = parseFloat(contentB);

		return sortByNumber(numberA, numberB, sortDir);
	}

	private sortByTag(
		cellA: Cell,
		cellB: Cell,
		columnTags: Tag[],
		sortDir: SortDir
	): number {
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
	}

	private sortByCheckboxCell(a: Cell, b: Cell, sortDir: SortDir): number {
		const { content: contentA } = a;
		const { content: contentB } = b;
		const isCheckedA = isCheckboxChecked(contentA);
		const isCheckedB = isCheckboxChecked(contentB);

		return sortByBoolean(isCheckedA, isCheckedB, sortDir);
	}

	private sortByDateCell(a: Cell, b: Cell, sortDir: SortDir): number {
		const dateTimeA = a.dateTime || 0;
		const dateTimeB = b.dateTime || 0;

		return sortByNumber(dateTimeA, dateTimeB, sortDir);
	}

	private sortByCreationTimeCell(a: Row, b: Row, sortDir: SortDir): number {
		return sortByNumber(a.creationTime, b.creationTime, sortDir);
	}

	private sortByLastEditedTimeCell(a: Row, b: Row, sortDir: SortDir): number {
		return sortByNumber(a.lastEditedTime, b.lastEditedTime, sortDir);
	}
}
