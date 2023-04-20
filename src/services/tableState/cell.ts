import { updateLastEditedTime } from "./row";
import { BodyCell, TableState } from "./types";

export const updateCell = (
	prevState: TableState,
	cellId: string,
	rowId: string,
	key: keyof BodyCell,
	value: unknown
) => {
	const { bodyCells, bodyRows } = prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			bodyCells: bodyCells.map((cell) => {
				if (cell.id === cellId) {
					return {
						...cell,
						[key as keyof BodyCell]: value,
					};
				}
				return cell;
			}),
			bodyRows: updateLastEditedTime(bodyRows, rowId),
		},
	};
};
