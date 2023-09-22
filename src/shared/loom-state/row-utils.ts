import { Row } from "./types/loom-state";
import RowNotFoundError from "../error/row-not-found-error";

export const rowLastEditedTime = (rows: Row[], rowId: string) => {
	const row = rows.find((row) => row.id === rowId);
	if (!row) throw new RowNotFoundError(rowId);
	return row.lastEditedTime;
};

export const rowLastEditedTimeUpdate = (
	rows: Row[],
	rowId: string,
	time = Date.now()
): Row[] => {
	return rows.map((row) => {
		if (row.id === rowId) {
			return {
				...row,
				lastEditedTime: time,
			};
		}
		return row;
	});
};
