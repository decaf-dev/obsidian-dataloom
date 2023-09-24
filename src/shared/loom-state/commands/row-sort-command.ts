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

		const { columns, rows } = prevState.model;
		const sortedColumns = columns.filter(
			(columns) => columns.sortDir !== SortDir.NONE
		);

		this.previousRowSort = rows.map((row) => ({
			id: row.id,
			index: row.index,
		}));

		let newRows = [...rows];

		if (sortedColumns.length !== 0) {
			newRows = this.multiSort(sortedColumns, rows);
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

	private multiSort = (sortedColumns: Column[], rows: Row[]) => {
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
				const comparison = this.sortByColumn(
					a,
					b,
					cellA,
					cellB,
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
		column: Column
	): number {
		const { type, sortDir, tags } = column;
		if (type === CellType.NUMBER) {
			return this.sortByNumber(cellA, cellB, sortDir);
		} else if (type === CellType.TAG || type === CellType.MULTI_TAG) {
			return this.sortByTag(cellA, cellB, tags, sortDir);
		} else if (type === CellType.DATE) {
			return this.sortByDate(cellA, cellB, sortDir);
		} else if (type === CellType.LAST_EDITED_TIME) {
			return this.sortByLastEditedTime(rowA, rowA, sortDir);
		} else if (type === CellType.CREATION_TIME) {
			return this.sortByCreationTime(rowB, rowB, sortDir);
		} else if (type === CellType.CHECKBOX) {
			return this.sortByCheckbox(cellA, cellB, sortDir);
		} else {
			return this.sortByText(cellA, cellB, sortDir);
		}
	}

	private sortByText(a: Cell, b: Cell, sortDir: SortDir): number {
		const { content: contentA } = a;
		const { content: contentB } = b;

		//Force empty cells to the bottom
		if (contentA === "" && contentB !== "") return 1;
		if (contentA !== "" && contentB === "") return -1;
		if (contentA === "" && contentB === "") return 0;

		if (sortDir === SortDir.ASC) {
			return contentA.localeCompare(contentB);
		} else if (sortDir === SortDir.DESC) {
			return contentB.localeCompare(contentA);
		} else {
			return 0;
		}
	}

	private sortByNumber(a: Cell, b: Cell, sortDir: SortDir): number {
		const { content: contentA } = a;
		const { content: contentB } = b;

		//Force empty cells to the bottom
		if (contentA === "" && contentB !== "") return 1;
		if (contentA !== "" && contentB === "") return -1;
		if (contentA === "" && contentB === "") return 0;

		if (sortDir === SortDir.ASC) {
			return parseFloat(contentA) - parseFloat(contentB);
		} else if (sortDir === SortDir.DESC) {
			return parseFloat(contentB) - parseFloat(contentA);
		} else {
			return 0;
		}
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

	private sortByCheckbox(a: Cell, b: Cell, sortDir: SortDir): number {
		const { content: contentA } = a;
		const { content: contentB } = b;
		const isCheckedA = isCheckboxChecked(contentA);
		const isCheckedB = isCheckboxChecked(contentB);

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

	private sortByDate(a: Cell, b: Cell, sortDir: SortDir): number {
		const dateTimeA = a.dateTime || 0;
		const dateTimeB = b.dateTime || 0;

		if (sortDir === SortDir.ASC) {
			return dateTimeA - dateTimeB;
		} else if (sortDir === SortDir.DESC) {
			return dateTimeB - dateTimeA;
		} else {
			return 0;
		}
	}

	private sortByCreationTime(a: Row, b: Row, sortDir: SortDir): number {
		if (sortDir === SortDir.ASC) {
			return a.creationTime - b.creationTime;
		} else if (sortDir === SortDir.DESC) {
			return b.creationTime - a.creationTime;
		} else {
			return 0;
		}
	}

	private sortByLastEditedTime(a: Row, b: Row, sortDir: SortDir): number {
		if (sortDir === SortDir.ASC) {
			return a.lastEditedTime - b.lastEditedTime;
		} else if (sortDir === SortDir.DESC) {
			return b.lastEditedTime - a.lastEditedTime;
		} else {
			return 0;
		}
	}
}
