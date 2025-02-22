import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import RowNotFoundError from "../../error/row-not-found-error";
import type { Cell, Column, Row } from "../types/loom-state";

export const getColumnCells = (rows: Row[], columnId: string): Cell[] => {
	return rows.map((row) => {
		const { cells } = row;
		const cell = cells.find((cell) => cell.columnId === columnId);
		if (!cell) throw new RowNotFoundError(row.id);
		return cell;
	});
};

export const mapCellsToColumn = (columns: Column[], rows: Row[]) => {
	const cellsToColumn = new Map<string, Column>();
	const cells = rows.flatMap((row) => row.cells);
	cells.forEach((cell) => {
		const column = columns.find((column) => column.id === cell.columnId);
		if (!column) throw new ColumnNotFoundError({ id: cell.columnId });
		cellsToColumn.set(cell.columnId, column);
	});
	return cellsToColumn;
};
