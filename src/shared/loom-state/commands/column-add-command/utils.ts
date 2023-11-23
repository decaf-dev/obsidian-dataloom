import CellNotFoundError from "src/shared/error/cell-not-found-error";
import { createCellForType, createColumn } from "../../loom-state-factory";
import { CellType, Column, Row } from "../../types/loom-state";
import { AddedCell } from "./types";

export const columnAddExecute = (
	prevColumns: Column[],
	prevRows: Row[],
	options?: {
		type?: CellType;
		insertIndex?: number;
		content?: string;
	}
) => {
	const { type = CellType.TEXT, insertIndex, content } = options || {};

	const nextColumns = [...prevColumns];

	const newColumn = createColumn({
		type,
		content,
	});
	nextColumns.splice(insertIndex ?? prevColumns.length, 0, newColumn);

	const addedCells: AddedCell[] = [];

	const nextRows: Row[] = prevRows.map((row) => {
		const { cells } = row;
		const newCell = createCellForType(newColumn.id, type);
		addedCells.push({
			rowId: row.id,
			cell: newCell,
		});
		const nextCells = [...cells, newCell];
		return {
			...row,
			cells: nextCells,
		};
	});

	return {
		columns: nextColumns,
		rows: nextRows,
		addedColumn: newColumn,
		addedCells,
	};
};

export const columnAddUndo = (
	prevColumns: Column[],
	prevRows: Row[],
	addedColumn: Column
) => {
	const nextColumns = prevColumns.filter(
		(column) => column.id !== addedColumn.id
	);
	const nextRows: Row[] = prevRows.map((row) => {
		const { cells } = row;
		const nextCells = cells.filter(
			(cell) => cell.columnId !== addedColumn.id
		);
		return {
			...row,
			cells: nextCells,
		};
	});

	return {
		columns: nextColumns,
		rows: nextRows,
	};
};

export const columnAddRedo = (
	prevColumns: Column[],
	prevRows: Row[],
	addedColumn: Column,
	addedCells: AddedCell[],
	options?: {
		insertIndex?: number;
	}
) => {
	const { insertIndex } = options || {};
	const nextColumns = [...prevColumns];
	nextColumns.splice(insertIndex ?? prevColumns.length, 0, addedColumn);

	const nextRows = prevRows.map((row) => {
		const { cells } = row;
		const cell = addedCells.find((c) => c.rowId === row.id);
		if (!cell) throw new CellNotFoundError({ rowId: row.id });
		const nextCells = [...cells, cell.cell];
		return {
			...row,
			cells: nextCells,
		};
	});

	return {
		columns: nextColumns,
		rows: nextRows,
	};
};
