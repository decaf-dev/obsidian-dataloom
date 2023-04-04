import { updateLastEditedTime } from "./row";
import { TableState } from "./types";

export const updateCell = (
	prevState: TableState,
	cellId: string,
	rowId: string,
	markdown: string
) => {
	const { cells, rows } = prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			cells: cells.map((cell) => {
				if (cell.id === cellId) {
					return {
						...cell,
						markdown,
					};
				}
				return cell;
			}),
			rows: updateLastEditedTime(rows, rowId),
		},
	};
};
