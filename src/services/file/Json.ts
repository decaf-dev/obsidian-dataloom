import { CURRENT_PLUGIN_VERSION } from "src/constants";
import { TableState } from "../table/types";

export default class Json {
	static serializeTableState() {}

	static deserializeTableState(data: string): TableState {
		const tableState = JSON.parse(data) as TableState;
		const { pluginVersion } = tableState;
		if (pluginVersion < CURRENT_PLUGIN_VERSION) {
			//Handle table produced by older plugin version
		}

		return {
			pluginVersion: 600,
			model: {
				rowIds: [],
				columnIds: [],
				cells: [],
			},
			settings: {
				columns: {},
				rows: {},
			},
		};
	}
}
