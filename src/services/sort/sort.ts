import { SortDir } from "./types";
import { TableState, Cell, Row } from "../tableState/types";
import { sortCells } from "../tableState/utils";

const sortByDir = (
	columnId: string,
	sortDir: SortDir,
	rows: Row[],
	cells: Cell[]
) => {
	const rowsCopy = [...rows];
	rowsCopy.sort((a, b) => {
		const cellA = cells.find(
			(c) => c.columnId === columnId && c.rowId === a.id
		);
		const cellB = cells.find(
			(c) => c.columnId === columnId && c.rowId === b.id
		);

		const markdownA = cellA?.markdown || "";
		const markdownB = cellB?.markdown || "";

		//Force empty cells to the bottom
		if (cellA?.isHeader) return -1;
		if (cellB?.isHeader) return 1;
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

const sortByCreationDate = (rows: Row[]) => {
	const rowsCopy = [...rows];
	rowsCopy.sort((a, b) => {
		return a.creationDate - b.creationDate;
	});
	return rowsCopy;
};

export const sortRows = (prevState: TableState): TableState => {
	const { columns, rows, cells } = prevState.model;
	const sortedColumn = columns.find(
		(columns) => columns.sortDir !== SortDir.NONE
	);
	if (sortedColumn) {
		return {
			...prevState,
			model: {
				...prevState.model,
				rows: sortByDir(
					sortedColumn.id,
					sortedColumn.sortDir,
					rows,
					cells
				),
				cells: sortCells(columns, rows, cells),
			},
		};
	}
	return {
		...prevState,
		model: {
			...prevState.model,
			rows: sortByCreationDate(rows),
		},
	};
};
