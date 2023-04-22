import { CURRENT_PLUGIN_VERSION } from "src/constants";
import {
	BaseTableState,
	CurrencyType,
	DateFormat,
	SortDir,
	TableState,
	TableState633,
} from "../tableState/types";
import { sortByCreationTime } from "../tableState/sort";
import { RowIdError } from "../tableState/error";
import StateFactory from "../tableState/StateFactory";

export default class Json {
	static serializeTableState(tableState: TableState): string {
		return JSON.stringify(tableState, null, 2);
	}

	static deserializeTableState(data: string): TableState {
		const parsedState = JSON.parse(data);
		const { pluginVersion } = parsedState as BaseTableState;
		if (pluginVersion <= 633) {
			const tableState = parsedState as TableState633;
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
			const tableState = parsedState as TableState633;
			const { columns, tags, rows, cells } = tableState.model;

			const updatedState: TableState = {
				...tableState,
				model: {
					columns: [],
					headerRows: [],
					bodyRows: [],
					footerRows: [],
					headerCells: [],
					bodyCells: [],
					footerCells: [],
					tags: [],
				},
			};

			//Create header rows
			updatedState.model.headerRows = [];
			updatedState.model.headerRows.push(StateFactory.createHeaderRow());

			//Create body rows
			updatedState.model.bodyRows = rows
				.filter((_row, i) => i !== 0)
				.map((row) => {
					return {
						id: row.id,
						index: row.index - 1,
						creationTime: row.creationTime,
						lastEditedTime: row.lastEditedTime,
						menuCellId: row.menuCellId,
					};
				});

			//Create footer rows
			updatedState.model.footerRows = [];
			updatedState.model.footerRows.push(StateFactory.createFooterRow());
			updatedState.model.footerRows.push(StateFactory.createFooterRow());

			//Update columns
			updatedState.model.columns = columns.map((column) => {
				return {
					id: column.id,
					sortDir: column.sortDir,
					width: column.width,
					type: column.type,
					isVisible: column.isVisible,
					dateFormat: column.dateFormat,
					currencyType: column.currencyType,
					shouldWrapOverflow: column.shouldWrapOverflow,
				};
			});

			//Create header cells
			updatedState.model.headerCells = cells
				.filter((cell) => cell.isHeader)
				.map((cell) => {
					return {
						id: cell.id,
						columnId: cell.columnId,
						rowId: updatedState.model.headerRows[0].id,
						markdown: cell.markdown,
					};
				});

			//Create body cells
			updatedState.model.bodyCells = cells
				.filter((cell) => !cell.isHeader)
				.map((cell) => {
					return {
						id: cell.id,
						columnId: cell.columnId,
						rowId: cell.rowId,
						dateTime: cell.dateTime,
						markdown: cell.markdown,
					};
				});

			//Create footer cells
			for (let i = 0; i < 2; i++) {
				columns.forEach((column) => {
					updatedState.model.footerCells.push(
						StateFactory.createFooterCell(
							column.id,
							updatedState.model.footerRows[i].id
						)
					);
				});
			}

			updatedState.model.tags = tags;
			updatedState.pluginVersion = 640;
			return updatedState;
		}

		parsedState.pluginVersion = CURRENT_PLUGIN_VERSION;
		return parsedState as TableState;
	}
}
