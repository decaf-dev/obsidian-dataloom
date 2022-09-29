import { TableModel } from "./types";

import { randomCellId, randomRowId } from "../random";

export const addRow = (model: TableModel): TableModel => {
	const { rowIds, columnIds, cells } = model;

	const rowId = randomRowId();
	const updatedCells = [...cells];

	for (let i = 0; i < columnIds.length; i++) {
		updatedCells.push({
			id: randomCellId(),
			columnId: columnIds[i],
			rowId,
			markdown: "",
			html: "",
			isHeader: false,
		});
	}

	return {
		...model,
		cells: updatedCells,
		rowIds: [...rowIds, rowId],
	};
};
