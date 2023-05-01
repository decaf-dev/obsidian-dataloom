import { isCheckboxChecked } from "../validators";
import { CellNotFoundError } from "./error";
import {
	TableState,
	BodyCell,
	BodyRow,
	CellType,
	SortDir,
} from "../../data/types";

const sortByDir = (
	columnId: string,
	columnType: string,
	sortDir: SortDir,
	rows: BodyRow[],
	cells: BodyCell[]
) => {
	if (columnType == CellType.NUMBER) {
		return sortByNumber(columnId, rows, cells, sortDir);
	} else if (columnType === CellType.DATE) {
		return sortByDate(columnId, rows, cells, sortDir);
	} else if (columnType == CellType.LAST_EDITED_TIME) {
		return sortByLastEditedTime(rows, sortDir);
	} else if (columnType == CellType.CREATION_TIME) {
		return sortByCreationTime(rows, sortDir);
	} else if (columnType == CellType.CHECKBOX) {
		return sortByCheckbox(columnId, rows, cells, sortDir);
	} else {
		return sortByMarkdown(columnId, rows, cells, sortDir);
	}
};

const sortByMarkdown = (
	columnId: string,
	rows: BodyRow[],
	cells: BodyCell[],
	sortDir: SortDir
): BodyRow[] => {
	const rowsCopy = structuredClone(rows);
	rowsCopy.sort((a, b) => {
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
	return rowsCopy;
};

const sortByNumber = (
	columnId: string,
	rows: BodyRow[],
	cells: BodyCell[],
	sortDir: SortDir
): BodyRow[] => {
	const rowsCopy = structuredClone(rows);
	rowsCopy.sort((a, b) => {
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
	return rowsCopy;
};

const sortByCheckbox = (
	columnId: string,
	rows: BodyRow[],
	cells: BodyCell[],
	sortDir: SortDir
): BodyRow[] => {
	const rowsCopy = structuredClone(rows);
	rowsCopy.sort((a, b) => {
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
	return rowsCopy;
};

export const sortByDate = (
	columnId: string,
	rows: BodyRow[],
	cells: BodyCell[],
	sortDir: SortDir
): BodyRow[] => {
	const rowsCopy = structuredClone(rows);
	rowsCopy.sort((a, b) => {
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
	return rowsCopy;
};

export const sortByCreationTime = (
	rows: BodyRow[],
	sortDir: SortDir
): BodyRow[] => {
	const rowsCopy = structuredClone(rows);
	rowsCopy.sort((a, b) => {
		if (sortDir === SortDir.ASC) {
			return a.creationTime - b.creationTime;
		} else if (sortDir === SortDir.DESC) {
			return b.creationTime - a.creationTime;
		} else {
			return 0;
		}
	});
	return rowsCopy;
};

const sortByLastEditedTime = (rows: BodyRow[], sortDir: SortDir): BodyRow[] => {
	const rowsCopy = structuredClone(rows);
	rowsCopy.sort((a, b) => {
		if (sortDir === SortDir.ASC) {
			return a.lastEditedTime - b.lastEditedTime;
		} else if (sortDir === SortDir.DESC) {
			return b.lastEditedTime - a.lastEditedTime;
		} else {
			return 0;
		}
	});
	return rowsCopy;
};

export const sortByRowIndex = (rows: BodyRow[]): BodyRow[] => {
	const rowsCopy = structuredClone(rows);
	rowsCopy.sort((a, b) => {
		return a.index - b.index;
	});
	return rowsCopy;
};

export const sortRows = (prevState: TableState): TableState => {
	const { columns, bodyRows, bodyCells } = prevState.model;
	const sortedColumn = columns.find(
		(columns) => columns.sortDir !== SortDir.NONE
	);
	if (sortedColumn) {
		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: sortByDir(
					sortedColumn.id,
					sortedColumn.type,
					sortedColumn.sortDir,
					bodyRows,
					bodyCells
				),
			},
		};
	}
	return {
		...prevState,
		model: {
			...prevState.model,
			bodyRows: sortByRowIndex(bodyRows),
		},
	};
};
