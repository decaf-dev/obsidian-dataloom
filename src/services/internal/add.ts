import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableSettings,
} from "../table/types";
import { v4 as uuid } from "uuid";
import { Cell } from "../table/types";

export const addRow = (model: TableModel): TableModel => {
	const cells: Cell[] = Array(model.numColumns).map((i) => {
		return {
			id: uuid(),
			textContent: "",
			content: "",
		};
	});
	return {
		...model,
		cells: [...model.cells, ...cells],
	};
};

export const addColumn = (
	model: TableModel,
	settings: TableSettings
): [TableModel, TableSettings] => {
	const { cells, numColumns } = model;

	const newCells = [];
	for (let i = 0; i < cells.length; i++) {
		newCells.push({ ...cells[i] });
		if ((i + 1) % numColumns === 0) {
			if ((i + 1) / numColumns === 1) {
				cells.push({
					id: uuid(),
					textContent: "New Column",
					content: "New Column",
				});
			} else {
				cells.push({
					id: uuid(),
					textContent: "",
					content: "",
				});
			}
		}
	}

	const settingsCopy = { ...settings };
	settingsCopy.columns[numColumns] = DEFAULT_COLUMN_SETTINGS;
	return [
		{
			...model,
			numColumns: numColumns + 1,
			cells,
		},
		settingsCopy,
	];
};
