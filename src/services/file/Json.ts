import { CURRENT_PLUGIN_VERSION } from "src/constants";
import {
	BaseTableState,
	CurrencyType,
	DateFormat,
	SortDir,
	TableState,
} from "../tableState/types";
import { sortByCreationTime } from "../tableState/sort";
import { RowIdError } from "../tableState/error";
import { PrevTableState } from "../tableState/types";

export default class Json {
	static serializeTableState(tableState: TableState): string {
		return JSON.stringify(tableState, null, 2);
	}

	static deserializeTableState(data: string): TableState {
		const parsedState = JSON.parse(data);
		const { pluginVersion } = parsedState as BaseTableState;
		if (pluginVersion < 630) {
			const tableState = parsedState as PrevTableState;
			const { columns, rows, cells } = tableState.model;

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

				//Feat: Column toggle
				columns.forEach((column: unknown) => {
					const typedColumn = column as Record<string, unknown>;
					typedColumn.isVisible = true;
				});

				//Feat: Date formats for Date type
				cells.forEach((cell) => {
					cell.dateTime = null;
				});
			}
		}

		//Upgrade to new table state
		if (pluginVersion < 640) {
			const tableState = parsedState as PrevTableState;
			//Create header rows
			//Create footer rows
			//Create body rows
			//Update columns
			//Create footer cells
			//Create body cells
			//Create header cells
		}

		parsedState.pluginVersion = CURRENT_PLUGIN_VERSION;
		return parsedState as TableState;
	}
}
