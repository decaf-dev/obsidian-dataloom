import { CURRENT_PLUGIN_VERSION } from "src/constants";
import {
	CurrencyType,
	DateFormat,
	SortDir,
	TableState,
} from "../tableState/types";
import { sortByCreationTime } from "../tableState/sort";
import { RowIdError } from "../tableState/error";

export default class Json {
	static serializeTableState(tableState: TableState): string {
		return JSON.stringify(tableState, null, 2);
	}

	static deserializeTableState(data: string): TableState {
		const tableState = JSON.parse(data) as TableState;
		const { pluginVersion } = tableState;
		const { columns, rows } = tableState.model;

		if (pluginVersion < CURRENT_PLUGIN_VERSION) {
			//Feat: Currency type
			if (pluginVersion < 610) {
				columns.forEach((column) => {
					column.currencyType = CurrencyType.UNITED_STATES;
				});
			}

			//Feat: Date formats
			if (pluginVersion < 620) {
				columns.forEach((column) => {
					column.dateFormat = DateFormat.YYYY_MM_DD;
				});
			}

			if (pluginVersion < 630) {
				//Feat: Double click to resize
				//Delete hasAutoWidth property from columns
				columns.forEach((column: unknown) => {
					const typedColumn = column as Record<string, unknown>;
					if (typedColumn.hasOwnProperty("hasAutoWidth")) {
						delete typedColumn.hasAutoWidth;
					}
				});

				//Feat: Drag and drag rows
				//Set the initial row index based on the creation time
				const sortedRows = sortByCreationTime(rows, SortDir.ASC);
				sortedRows.forEach((row, i) => {
					const loadedRow = rows.find((r) => r.id === row.id);
					if (!loadedRow) throw new RowIdError(row.id);
					//Set the index based on the index of the sorted row
					loadedRow.index = i;
				});
			}
		}
		tableState.pluginVersion = CURRENT_PLUGIN_VERSION;
		return tableState;
	}
}
