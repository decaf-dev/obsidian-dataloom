import {
	CellNotFoundError,
	RowNotFoundError,
} from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import {
	BodyCell,
	BodyRow,
	CellType,
	SortDir,
	TableState,
} from "../types/types";
import { isCheckboxChecked } from "../validators";

export default class RowSortCommand extends TableStateCommand {
	/**
	 * The previous row sort state
	 */
	private previousRowSort: {
		id: string;
		index: number;
	}[] = [];

	//TODO IMPLEMENT NEXT
	private sortByTag(
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

			if (!cellA) throw new CellNotFoundError();

			const cellB = cells.find(
				(c) => c.columnId === columnId && c.rowId === b.id
			);

			if (!cellB) throw new CellNotFoundError();

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

			if (!cellA) throw new CellNotFoundError();

			const cellB = cells.find(
				(c) => c.columnId === columnId && c.rowId === b.id
			);

			if (!cellB) throw new CellNotFoundError();

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

			if (!cellA) throw new CellNotFoundError();

			const cellB = cells.find(
				(c) => c.columnId === columnId && c.rowId === b.id
			);

			if (!cellB) throw new CellNotFoundError();

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

			if (!cellA) throw new CellNotFoundError();

			const cellB = cells.find(
				(c) => c.columnId === columnId && c.rowId === b.id
			);

			if (!cellB) throw new CellNotFoundError();

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

			if (!cellA) throw new CellNotFoundError();

			const cellB = cells.find(
				(c) => c.columnId === columnId && c.rowId === b.id
			);

			if (!cellB) throw new CellNotFoundError();

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
		rows: BodyRow[],
		cells: BodyCell[]
	) {
		if (columnType == CellType.NUMBER || columnType === CellType.CURRENCY) {
			return this.sortByNumber(columnId, rows, cells, sortDir);
		} else if (
			columnType === CellType.TAG ||
			columnType === CellType.MULTI_TAG
		) {
			return this.sortByTag(columnId, rows, cells, sortDir);
		} else if (columnType === CellType.DATE) {
			return this.sortByDate(columnId, rows, cells, sortDir);
		} else if (columnType == CellType.LAST_EDITED_TIME) {
			return this.sortByLastEditedTime(rows, sortDir);
		} else if (columnType == CellType.CREATION_TIME) {
			return this.sortByCreationTime(rows, sortDir);
		} else if (columnType == CellType.CHECKBOX) {
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

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { columns, bodyRows, bodyCells } = prevState.model;
		const sortedColumn = columns.find(
			(columns) => columns.sortDir !== SortDir.NONE
		);

		let newBodyRows = [...bodyRows];

		console.log("Original", newBodyRows);

		this.previousRowSort = bodyRows.map((row) => ({
			id: row.id,
			index: row.index,
		}));

		if (sortedColumn) {
			console.log("Sorting by dir");
			newBodyRows = this.sortByDir(
				sortedColumn.id,
				sortedColumn.type,
				sortedColumn.sortDir,
				bodyRows,
				bodyCells
			);
		} else {
			newBodyRows = this.sortByIndex(bodyRows);
		}

		console.log("New body rows", newBodyRows);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: newBodyRows,
			},
		};
	}
	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}
	undo(prevState: TableState): TableState {
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
		console.log("Previous", newBodyRows);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: newBodyRows,
			},
		};
	}
}
