import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import { Column, Filter, Row } from "../../types/loom-state";
import CellNotFoundError from "src/shared/error/cell-not-found-error";

export const columnDeleteExecute = (
	prevColumns: Column[],
	prevRows: Row[],
	prevFilters: Filter[],
	id: string
) => {
	//Maintains at least 1 column in the table
	if (prevColumns.length === 1) {
		return null;
	}

	const columnToDelete = prevColumns.find((column) => column.id === id);
	if (!columnToDelete) throw new ColumnNotFoundError({ id });

	const nextColumns = prevColumns.filter((column) => column.id !== id);

	const nextRows: Row[] = prevRows.map((row) => {
		const { cells } = row;
		const cell = row.cells.find((cell) => cell.columnId === id);
		if (!cell)
			throw new CellNotFoundError({
				columnId: id,
				rowId: row.id,
			});

		const nextCells = cells.filter((cell) => cell.columnId !== id);
		return {
			...row,
			cells: nextCells,
		};
	});

	const nextFilters = prevFilters.filter((filter) => filter.columnId !== id);

	return {
		nextColumns,
		nextRows,
		nextFilters,
	};
};
