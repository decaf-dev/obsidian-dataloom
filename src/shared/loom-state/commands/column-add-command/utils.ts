import { createCellForType, createColumn } from "../../loom-state-factory";
import { CellType, type Column, type Row } from "../../types/loom-state";

export const columnAddExecute = (
	prevColumns: Column[],
	prevRows: Row[],
	options?: {
		type?: CellType;
		insertIndex?: number;
		content?: string;
	}
) => {
	const { type = CellType.TEXT, insertIndex, content } = options ?? {};

	const nextColumns = [...prevColumns];

	const newColumn = createColumn({
		type,
		content,
	});
	nextColumns.splice(insertIndex ?? prevColumns.length, 0, newColumn);

	const nextRows: Row[] = prevRows.map((row) => {
		const { cells } = row;
		const newCell = createCellForType(newColumn.id, type);
		const nextCells = [...cells, newCell];
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
