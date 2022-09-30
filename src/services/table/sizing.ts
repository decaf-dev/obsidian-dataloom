import { CellType } from "./types";

export const findCellWidth = (
	columnType: string,
	useAutoWidth: boolean,
	width: string
) => {
	if (columnType !== CellType.TEXT && columnType !== CellType.NUMBER)
		return width;
	if (useAutoWidth) return "max-content";
	return width;
};
