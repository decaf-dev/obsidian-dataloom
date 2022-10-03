import { DEFAULT_ROW_SETTINGS, TableState } from "./types";

import { randomCellId, randomRowId } from "../random";

export const addRow = (prevState: TableState): TableState => {
	const rowId = randomRowId();
	const cellsCopy = [...prevState.model.cells];

	for (let i = 0; i < prevState.model.columnIds.length; i++) {
		cellsCopy.push({
			id: randomCellId(),
			columnId: prevState.model.columnIds[i],
			rowId,
			markdown: "",
			html: "",
			isHeader: false,
		});
	}

	const settingsCopy = { ...prevState.settings.rows };
	settingsCopy[rowId] = { ...DEFAULT_ROW_SETTINGS };
	settingsCopy[rowId].creationDate = Date.now();

	return {
		...prevState,
		model: {
			...prevState.model,
			cells: cellsCopy,
			rowIds: [...prevState.model.rowIds, rowId],
		},
		settings: {
			...prevState.settings,
			rows: settingsCopy,
		},
	};
};
