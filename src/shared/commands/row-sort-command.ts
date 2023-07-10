import {
	CellNotFoundError,
	ColumNotFoundError,
	RowNotFoundError,
	TagNotFoundError,
} from "../table-state/loom-error";
import LoomStateCommand from "../table-state/loom-state-command";
import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	SortDir,
	LoomState,
} from "../types";
import { isCheckboxChecked } from "../match";

export default class RowSortCommand extends LoomStateCommand {
	/**
	 * The previous row sort state
	 */
	private previousRowSort: {
		id: string;
		index: number;
	}[] = [];

	private sortByTag(
		columnId: string,
		columns: Column[],
		rows: BodyRow[],
		cells: BodyCell[],
		sortDir: SortDir
	): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
			const cellA = cells.find(
				(c) => c.columnId === columnId && c.rowId === a.id
			);
			if (!cellA) throw new CellNotFoundError({ rowId: a.id, columnId });

			const cellB = cells.find(
				(c) => c.columnId === columnId && c.rowId === b.id
			);
			if (!cellB) throw new CellNotFoundError({ rowId: b.id, columnId });

			const column = columns.find((c) => c.id === columnId);
			if (!column) throw new ColumNotFoundError(columnId);

			//Force empty cells to the bottom
			if (cellA.tagIds.length === 0 && cellB.tagIds.length > 0) return 1;
			if (cellA.tagIds.length > 0 && cellB.tagIds.length === 0) return -1;
			if (cellA.tagIds.length === 0 && cellB.tagIds.length === 0)
				return 0;

			let tagLength = cellA.tagIds.length;
			if (cellB.tagIds.length > cellA.tagIds.length) {
				tagLength = cellB.tagIds.length;
			}

			for (let i = 0; i < tagLength; i++) {
				const tagIdA: string | undefined = cellA.tagIds[i];
				if (tagIdA === undefined) return -1;
				const tagA = column.tags.find((t) => t.id === tagIdA);
				if (!tagA) throw new TagNotFoundError(tagIdA);

				const tagIdB: string | undefined = cellB.tagIds[i];
				if (tagIdB === undefined) return 1;
				const tagB = column.tags.find((t) => t.id === tagIdB);
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
		});
		return newRows;
	}

	private sortByMarkdown(
		columnId: string,
		rows: BodyRow[],
		cells: BodyCell[],
		sortDir: SortDir
	): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
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
		});
		return newRows;
	}

	private sortByNumber(
		columnId: string,
		rows: BodyRow[],
		cells: BodyCell[],
		sortDir: SortDir
	): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
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
		});
		return newRows;
	}

	private sortByCheckbox(
		columnId: string,
		rows: BodyRow[],
		cells: BodyCell[],
		sortDir: SortDir
	): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
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
		});
		return newRows;
	}

	private sortByDate(
		columnId: string,
		rows: BodyRow[],
		cells: BodyCell[],
		sortDir: SortDir
	): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
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

			const dateTimeA = cellA.dateTime || 0;
			const dateTimeB = cellB.dateTime || 0;

			if (sortDir === SortDir.ASC) {
				return dateTimeA - dateTimeB;
			} else if (sortDir === SortDir.DESC) {
				return dateTimeB - dateTimeA;
			} else {
				return 0;
			}
		});
		return newRows;
	}

	private sortByCreationTime(rows: BodyRow[], sortDir: SortDir): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
			if (sortDir === SortDir.ASC) {
				return a.creationTime - b.creationTime;
			} else if (sortDir === SortDir.DESC) {
				return b.creationTime - a.creationTime;
			} else {
				return 0;
			}
		});
		return newRows;
	}

	private sortByLastEditedTime(rows: BodyRow[], sortDir: SortDir): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
			if (sortDir === SortDir.ASC) {
				return a.lastEditedTime - b.lastEditedTime;
			} else if (sortDir === SortDir.DESC) {
				return b.lastEditedTime - a.lastEditedTime;
			} else {
				return 0;
			}
		});
		return newRows;
	}

	private sortByDir(
		columnId: string,
		columnType: string,
		sortDir: SortDir,
		columns: Column[],
		rows: BodyRow[],
		cells: BodyCell[]
	) {
		if (
			columnType === CellType.NUMBER ||
			columnType === CellType.CURRENCY
		) {
			return this.sortByNumber(columnId, rows, cells, sortDir);
		} else if (
			columnType === CellType.TAG ||
			columnType === CellType.MULTI_TAG
		) {
			return this.sortByTag(columnId, columns, rows, cells, sortDir);
		} else if (columnType === CellType.DATE) {
			return this.sortByDate(columnId, rows, cells, sortDir);
		} else if (columnType === CellType.LAST_EDITED_TIME) {
			return this.sortByLastEditedTime(rows, sortDir);
		} else if (columnType === CellType.CREATION_TIME) {
			return this.sortByCreationTime(rows, sortDir);
		} else if (columnType === CellType.CHECKBOX) {
			return this.sortByCheckbox(columnId, rows, cells, sortDir);
		} else {
			return this.sortByMarkdown(columnId, rows, cells, sortDir);
		}
	}

	private sortByIndex(rows: BodyRow[]): BodyRow[] {
		const newRows = [...rows];
		newRows.sort((a, b) => {
			return a.index - b.index;
		});
		return newRows;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, bodyRows, bodyCells } = prevState.model;
		const sortedColumn = columns.find(
			(columns) => columns.sortDir !== SortDir.NONE
		);

		this.previousRowSort = bodyRows.map((row) => ({
			id: row.id,
			index: row.index,
		}));

		let newBodyRows = [...bodyRows];

		if (sortedColumn) {
			newBodyRows = this.sortByDir(
				sortedColumn.id,
				sortedColumn.type,
				sortedColumn.sortDir,
				columns,
				bodyRows,
				bodyCells
			);
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
}
