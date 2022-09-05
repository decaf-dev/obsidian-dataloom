import { AppData } from "../state/types";
import { TabbableElement } from "../state/tabbableElement";
import { TABBABLE_ELEMENT_TYPE } from "src/constants";

export const findTabbableElement = (
	data: AppData,
	id: string
): TabbableElement => {
	const matrix = findTabbableElementMatrix(data);
	const index = matrix.findIndex((obj) => obj.id === id);
	return matrix[index];
};

export const findNextTabbableElement = (
	data: AppData,
	id: string
): TabbableElement => {
	const matrix = findTabbableElementMatrix(data);
	const index = matrix.findIndex((obj) => obj.id === id);
	return matrix[(index + 1) % matrix.length];
};

export const findTabbableElementMatrix = (data: AppData): TabbableElement[] => {
	const tabbableElementMatrix: TabbableElement[] = [];
	// data.headers.forEach((header) => {
	// 	tabbableElementMatrix.push({
	// 		[header.id]: TABBABLE_ELEMENT_TYPE.HEADER,
	// 	});
	// });
	//tabbableElementMatrix.push({ [`button-0`]: TABBABLE_ELEMENT_TYPE.BUTTON });

	data.rows.forEach((row, i) => {
		data.headers.forEach((header) => {
			const cell = data.cells.find(
				(cell) => cell.rowId === row.id && cell.headerId === header.id
			);
			tabbableElementMatrix.push({
				id: cell.id,
				type: TABBABLE_ELEMENT_TYPE.CELL,
			});
		});
		// tabbableElementMatrix.push({
		// 	[`button-${i + 1}`]: TABBABLE_ELEMENT_TYPE.BUTTON,
		// });
	});
	// tabbableElementMatrix.push({
	// 	[`button-${data.rows.length + 1}`]: TABBABLE_ELEMENT_TYPE.BUTTON,
	// });
	return tabbableElementMatrix;
};
