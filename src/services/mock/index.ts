import { CURRENT_PLUGIN_VERSION } from "src/constants";
import StateFactory from "../tableState/StateFactory";
import { Cell, Column, Row, TableState, Tag } from "../tableState/types";

export const mockTableState = (
	numColumns: number,
	numRows: number
): TableState => {
	const columns: Column[] = [];
	for (let i = 0; i < numColumns; i++)
		columns.push(StateFactory.createColumn());

	const rows: Row[] = [];
	for (let i = 0; i < numRows; i++) rows.push(StateFactory.createRow());

	const cells: Cell[] = [];
	for (let y = 0; y < numRows; y++) {
		for (let x = 0; x < numColumns; x++) {
			cells.push(
				StateFactory.createCell(columns[x].id, rows[y].id, y === 0)
			);
		}
	}

	const tags: Tag[] = [];
	//TODO add tags
	return {
		model: {
			rows,
			columns,
			cells,
			tags,
		},
		pluginVersion: CURRENT_PLUGIN_VERSION,
	};
};
