import { CURRENT_PLUGIN_VERSION } from "src/constants";
import {
	Column,
	CurrencyType,
	DateFormat,
	TableState,
} from "../tableState/types";

export default class Json {
	static serializeTableState(tableState: TableState): string {
		return JSON.stringify(tableState, null, 2);
	}

	static deserializeTableState(data: string): TableState {
		const tableState = JSON.parse(data) as TableState;
		const { pluginVersion } = tableState;
		if (pluginVersion < CURRENT_PLUGIN_VERSION) {
			//Currency type feature
			if (pluginVersion < 610) {
				tableState.model.columns.forEach((column) => {
					column.currencyType = CurrencyType.UNITED_STATES;
				});
			}

			//Date format feature
			if (pluginVersion < 620) {
				tableState.model.columns.forEach((column) => {
					column.dateFormat = DateFormat.YYYY_MM_DD;
				});
			}

			//Removal of auto width
			if (pluginVersion < 630) {
				tableState.model.columns.forEach((column: unknown) => {
					const typedColumn = column as Record<string, unknown>;
					if (typedColumn.hasOwnProperty("hasAutoWidth")) {
						delete typedColumn.hasAutoWidth;
					}
				});
			}
		}
		tableState.pluginVersion = CURRENT_PLUGIN_VERSION;
		return tableState;
	}
}
