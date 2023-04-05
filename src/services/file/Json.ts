import { CURRENT_PLUGIN_VERSION } from "src/constants";
import { CurrencyType, TableState } from "../tableState/types";

export default class Json {
	static serializeTableState(tableState: TableState): string {
		return JSON.stringify(tableState, null, 2);
	}

	static deserializeTableState(data: string): TableState {
		const tableState = JSON.parse(data) as TableState;
		const { pluginVersion } = tableState;
		if (pluginVersion < CURRENT_PLUGIN_VERSION) {
			//Handle currency type update
			if (pluginVersion < 610) {
				tableState.model.columns.forEach((column) => {
					column.currencyType = CurrencyType.UNITED_STATES;
				});
			}
		}
		tableState.pluginVersion = CURRENT_PLUGIN_VERSION;
		return tableState;
	}
}
