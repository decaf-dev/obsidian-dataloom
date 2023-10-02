import CellNotFoundError from "../../error/cell-not-found-error";
import { CellType, Column, Row } from "../types/loom-state";

export const filterUniqueRows = (
	columns: Column[],
	rows: Row[],
	cellType: CellType
) => {
	const uniqueValues: string[] = [];

	// Filter the array to include only objects with unique content values
	return rows.filter((row) => {
		if (row.sourceId === null) return true;

		const { cells } = row;
		for (const column of columns) {
			const { id, type } = column;
			if (type !== cellType) continue;

			const cell = cells.find((cell) => cell.columnId === id);
			if (!cell) throw new CellNotFoundError({ columnId: id });

			const { content } = cell;
			if (!uniqueValues.includes(content)) {
				uniqueValues.push(content);
				return true;
			}
			return false;
		}
	});
};
