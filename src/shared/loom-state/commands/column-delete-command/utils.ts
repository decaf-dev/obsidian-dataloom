import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import { Column, Filter, Row } from "../../types/loom-state";
import { DeletedCell, DeletedColumn, DeletedFilter } from "./types";
import { cloneDeep } from "lodash";
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

	const deletedColumn: DeletedColumn = {
		arrIndex: prevColumns.indexOf(columnToDelete),
		column: cloneDeep(columnToDelete),
	};

	const nextColumns = prevColumns.filter((column) => column.id !== id);

	const deletedCells: DeletedCell[] = [];

	const nextRows: Row[] = prevRows.map((row) => {
		const { cells } = row;
		const cell = row.cells.find((cell) => cell.columnId === id);
		if (!cell)
			throw new CellNotFoundError({
				columnId: id,
				rowId: row.id,
			});

		deletedCells.push({
			rowId: row.id,
			cell: cloneDeep(cell),
			arrIndex: row.cells.indexOf(cell),
		});

		const nextCells = cells.filter((cell) => cell.columnId !== id);
		return {
			...row,
			cells: nextCells,
		};
	});

	const filtersToDelete = prevFilters.filter(
		(filter) => filter.columnId === id
	);
	const deletedFilters: DeletedFilter[] = filtersToDelete.map((filter) => ({
		arrIndex: prevFilters.indexOf(filter),
		filter: cloneDeep(filter),
	}));

	const nextFilters = prevFilters.filter((filter) => filter.columnId !== id);

	return {
		nextColumns,
		nextRows,
		nextFilters,
		deletedCells,
		deletedColumn,
		deletedFilters,
	};
};

export const columnDeleteUndo = (
	prevColumns: Column[],
	prevRows: Row[],
	prevFilters: Filter[],
	deletedColumn: DeletedColumn,
	deletedCells: DeletedCell[],
	deletedFilters: DeletedFilter[]
) => {
	const nextColumns: Column[] = [...prevColumns];
	nextColumns.splice(deletedColumn.arrIndex, 0, deletedColumn.column);
	console.log(nextColumns);

	const nextRows: Row[] = prevRows.map((row) => {
		const { cells } = row;
		const nextCells = [...cells];
		const cellsToAdd = deletedCells.filter((cell) => cell.rowId === row.id);
		cellsToAdd.forEach((cell) => {
			nextCells.splice(cell.arrIndex, 0, cell.cell);
		});
		return {
			...row,
			cells: nextCells,
		};
	});

	const nextFilters = [...prevFilters];
	deletedFilters.forEach((filter) => {
		nextFilters.splice(filter.arrIndex, 0, filter.filter);
	});

	return {
		nextColumns,
		nextRows,
		nextFilters,
	};
};
