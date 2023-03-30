import { CURRENT_PLUGIN_VERSION } from "src/constants";
import StateFactory from "../tableState/StateFactory";
import { TableState } from "../tableState/types";

export default class Json {
	static serializeTableState() {}

	static deserializeTableState(data: string): TableState {
		const tableState = JSON.parse(data) as TableState;
		const { pluginVersion } = tableState;
		if (pluginVersion < CURRENT_PLUGIN_VERSION) {
			//Handle table produced by older plugin version
		}

		const row = StateFactory.createRow();
		const column = StateFactory.createColumn();
		const cell = StateFactory.createCell(column.id, row.id, true);
		return {
			pluginVersion: 600,
			model: {
				columns: [column],
				rows: [row],
				cells: [cell],
			},
		};
	}
}
