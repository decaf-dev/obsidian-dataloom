import CellNotFoundError from "src/shared/error/cell-not-found-error";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import TagNotFoundError from "src/shared/error/tag-not-found-error";
import LoomStateCommand from "./loom-state-command";
import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	SortDir,
	LoomState,
	Tag,
} from "../types/loom-state";
import { isCheckboxChecked } from "../../match";

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

		const { columns, bodyRows, bodyCells } = prevState.model;
		const columnsToSortBy = columns.filter(
			(columns) => columns.sortDir !== SortDir.NONE
		);

		this.previousRowSort = bodyRows.map((row) => ({
			id: row.id,
			index: row.index,
		}));

		let newBodyRows = [...bodyRows];

		if (columnsToSortBy.length !== 0) {
			newBodyRows = this.multiSort(columnsToSortBy, bodyRows, bodyCells);
		} else {
			newBodyRows = this.sortByIndex(bodyRows);
		}

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: newBodyRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { bodyRows } = prevState.model;
		const newBodyRows = this.previousRowSort.map((prev) => {
			const row = bodyRows.find((row) => row.id === prev.id);
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
				bodyRows: newBodyRows,
			},
		};
	}

	private multiSort = (
		columnsToSortBy: Column[],
		rows: BodyRow[],
		cells: BodyCell[]
	) => {
		const rowsCopy = [...rows];
		rowsCopy.sort((a, b) => {
			for (const column of columnsToSortBy) {
				const comparison = this.sortByColumn(a, b, column, cells);
				if (comparison !== 0) {
					return comparison;
				}
			}
			return 0;
		});
		return rowsCopy;
	};

	private sortByIndex(rows: BodyRow[]): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
			return a.index - b.index;
		});
		return newRows;
	}

	private sortByColumn(
		a: BodyRow,
		b: BodyRow,
		column: Column,
		cells: BodyCell[]
	): number {
		const { id, type, sortDir, tags } = column;
		if (type === CellType.NUMBER) {
			return this.sortByNumber(a, b, id, cells, sortDir);
		} else if (type === CellType.TAG || type === CellType.MULTI_TAG) {
			return this.sortByTag(a, b, id, tags, cells, sortDir);
		} else if (type === CellType.DATE) {
			return this.sortByDate(a, b, id, cells, sortDir);
		} else if (type === CellType.LAST_EDITED_TIME) {
			return this.sortByLastEditedTime(a, b, sortDir);
		} else if (type === CellType.CREATION_TIME) {
			return this.sortByCreationTime(a, b, sortDir);
		} else if (type === CellType.CHECKBOX) {
			return this.sortByCheckbox(a, b, id, cells, sortDir);
		} else {
			return this.sortByText(a, b, id, cells, sortDir);
		}
	}

	private sortByText(
		a: BodyRow,
		b: BodyRow,
		columnId: string,
		cells: BodyCell[],
		sortDir: SortDir
	): number {
		const { cellA, cellB } = this.findCellAB(a, b, columnId, cells);

		const markdownA = cellA.markdown;
		const markdownB = cellB.markdown;

		//Force empty cells to the bottom
		if (markdownA === "" && markdownB !== "") return 1;
		if (markdownA !== "" && markdownB === "") return -1;
		if (markdownA === "" && markdownB === "") return 0;

		if (sortDir === SortDir.ASC) {
			return markdownA.localeCompare(markdownB);
		} else if (sortDir === SortDir.DESC) {
			return markdownB.localeCompare(markdownA);
		} else {
			return 0;
		}
	}

	private sortByNumber(
		a: BodyRow,
		b: BodyRow,
		columnId: string,
		cells: BodyCell[],
		sortDir: SortDir
	): number {
		const { cellA, cellB } = this.findCellAB(a, b, columnId, cells);

		const markdownA = cellA.markdown;
		const markdownB = cellB.markdown;

		//Force empty cells to the bottom
		if (markdownA === "" && markdownB !== "") return 1;
		if (markdownA !== "" && markdownB === "") return -1;
		if (markdownA === "" && markdownB === "") return 0;

		if (sortDir === SortDir.ASC) {
			return parseFloat(markdownA) - parseFloat(markdownB);
		} else if (sortDir === SortDir.DESC) {
			return parseFloat(markdownB) - parseFloat(markdownA);
		} else {
			return 0;
		}
	}

	private sortByTag(
		a: BodyRow,
		b: BodyRow,
		columnId: string,
		columnTags: Tag[],
		cells: BodyCell[],
		sortDir: SortDir
	): number {
		const { cellA, cellB } = this.findCellAB(a, b, columnId, cells);

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
				const result = tagA.markdown.localeCompare(tagB.markdown);
				if (result !== 0) return result;
			} else if (sortDir === SortDir.DESC) {
				const result = tagB.markdown.localeCompare(tagA.markdown);
				if (result !== 0) return result;
			}
		}
		//If we got here, that means the cells have the exact same tags
		return 0;
	}

	private sortByCheckbox(
		a: BodyRow,
		b: BodyRow,
		columnId: string,
		cells: BodyCell[],
		sortDir: SortDir
	): number {
		const { cellA, cellB } = this.findCellAB(a, b, columnId, cells);

		const isCheckedA = isCheckboxChecked(cellA.markdown);
		const isCheckedB = isCheckboxChecked(cellB.markdown);

		if (sortDir === SortDir.ASC) {
			if (isCheckedA && !isCheckedB) return 1;
			if (!isCheckedA && isCheckedB) return -1;
			return 0;
		} else if (sortDir === SortDir.DESC) {
			if (!isCheckedA && isCheckedB) return 1;
			if (isCheckedA && !isCheckedB) return -1;
			return 0;
		} else {
			return 0;
		}
	}

	private sortByDate(
		a: BodyRow,
		b: BodyRow,
		columnId: string,
		cells: BodyCell[],
		sortDir: SortDir
	): number {
		const { cellA, cellB } = this.findCellAB(a, b, columnId, cells);
		const dateTimeA = cellA.dateTime || 0;
		const dateTimeB = cellB.dateTime || 0;

		if (sortDir === SortDir.ASC) {
			return dateTimeA - dateTimeB;
		} else if (sortDir === SortDir.DESC) {
			return dateTimeB - dateTimeA;
		} else {
			return 0;
		}
	}

	private sortByCreationTime(
		a: BodyRow,
		b: BodyRow,
		sortDir: SortDir
	): number {
		if (sortDir === SortDir.ASC) {
			return a.creationTime - b.creationTime;
		} else if (sortDir === SortDir.DESC) {
			return b.creationTime - a.creationTime;
		} else {
			return 0;
		}
	}

	private sortByLastEditedTime(
		a: BodyRow,
		b: BodyRow,
		sortDir: SortDir
	): number {
		if (sortDir === SortDir.ASC) {
			return a.lastEditedTime - b.lastEditedTime;
		} else if (sortDir === SortDir.DESC) {
			return b.lastEditedTime - a.lastEditedTime;
		} else {
			return 0;
		}
	}

	private findCellAB = (
		a: BodyRow,
		b: BodyRow,
		columnId: string,
		cells: BodyCell[]
	) => {
		const cellA = cells.find(
			(c) => c.columnId === columnId && c.rowId === a.id
		);

		if (!cellA)
			throw new CellNotFoundError({
				rowId: a.id,
				columnId,
			});

		const cellB = cells.find(
			(c) => c.columnId === columnId && c.rowId === b.id
		);

		if (!cellB)
			throw new CellNotFoundError({
				rowId: b.id,
				columnId,
			});
		return { cellA, cellB };
	};
}
