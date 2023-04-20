import { updateLastEditedTime } from "./row";
import { BodyCell, HeaderCell, TableState } from "./types";

export const updateHeaderCell = (
	prevState: TableState,
	cellId: string,
	key: keyof HeaderCell,
	value: unknown
) => {
	const { headerCells } = prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			headerCells: headerCells.map((cell) => {
				if (cell.id === cellId) {
					return {
						...cell,
						[key as keyof BodyCell]: value,
					};
				}
				return cell;
			}),
		},
	};
};

export const updateBodyCell = (
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
