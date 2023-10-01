import RowNotFoundError from "../error/row-not-found-error";
import { Cell, Row } from "./types/loom-state";

export const getColumnCells = (rows: Row[], columnId: string): Cell[] => {
	return rows.map((row) => {
		const { cells } = row;
		const cell = cells.find((cell) => cell.columnId === columnId);
		if (!cell) throw new RowNotFoundError(row.id);
		return cell;
	});
};
