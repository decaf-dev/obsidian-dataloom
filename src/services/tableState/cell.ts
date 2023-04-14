import { updateLastEditedTime } from "./row";
import { Cell, TableState } from "./types";

export const updateCell = (
	prevState: TableState,
	cellId: string,
	rowId: string,
	key: keyof Cell,
	value: unknown
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
						[key as keyof Cell]: value,
					};
				}
				return cell;
			}),
			rows: updateLastEditedTime(rows, rowId),
		},
	};
};
