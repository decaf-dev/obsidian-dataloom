import { CURRENT_PLUGIN_VERSION } from "src/data/constants";
import {
	BodyCell,
	CellType,
	Column,
	TableState,
	Tag,
} from "../shared/types/types";
import { TableState630 } from "src/shared/types/types-6.3.0";
import {
	GeneralFunction670,
	TableState670,
} from "src/shared/types/types-6.7.0";
import {
	CellIdError,
	ColumNotFoundError,
} from "../shared/table-state/table-error";
import { createFooterRow, createHeaderRow } from "./table-state-factory";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "src/shared/table-state/constants";
import { TableState680 } from "src/shared/types/types-6.8.0";
import { TableState600 } from "src/shared/types/types-6.0.0";
import { CurrencyType610, TableState610 } from "src/shared/types/types-6.1.0";
import { DateFormat620, TableState620 } from "src/shared/types/types-6.2.0";
import { v4 as uuidv4 } from "uuid";
import { TableState691 } from "src/shared/types/types-6.9.1";
import {
	isVersionLessThan,
	legacyVersionToString,
} from "src/shared/versioning";

export const serializeTableState = (tableState: TableState): string => {
	return JSON.stringify(tableState, null, 2);
};

export const deserializeTableState = (data: string): TableState => {
	const parsedState = JSON.parse(data);

	const untypedVersion: unknown = parsedState["pluginVersion"];

	let pluginVersion = "";
	if (typeof untypedVersion === "number") {
		pluginVersion = legacyVersionToString(untypedVersion);
	} else if (typeof untypedVersion === "string") {
		pluginVersion = untypedVersion;
	}

	let currentState: unknown = parsedState;

	if (isVersionLessThan(pluginVersion, "6.1.0")) {
		const tableState = currentState as TableState600;
		const { columns } = tableState.model;

		//Feat: Currency type
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.currencyType = CurrencyType610.UNITED_STATES;
		});
	}

	if (isVersionLessThan(pluginVersion, "6.2.0")) {
		const tableState = currentState as TableState610;
		const { columns } = tableState.model;

		//Feat: Date formats
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.dateFormat = DateFormat620.YYYY_MM_DD;
		});
	}

	if (isVersionLessThan(pluginVersion, "6.3.0")) {
		const tableState = currentState as TableState620;
		const { columns, rows, cells } = tableState.model;

		//Feat: Double click to resize
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			if (typedColumn.hasOwnProperty("hasAutoWidth")) {
				delete typedColumn.hasAutoWidth;
			}
		});

		//Feat: Drag and drag rows
		//Set the initial row index based on the creation time
		rows.forEach((row: unknown, i) => {
			const typedRow = row as Record<string, unknown>;
			typedRow.index = i;
		});

		//Feat: Column toggle
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.isVisible = true;
		});

		//Feat: Date formats for Date type
		cells.forEach((cell: unknown) => {
			const typedCell = cell as Record<string, unknown>;
			typedCell.dateTime = null;
		});
	}

	//Feat: new table state structure
	if (isVersionLessThan(pluginVersion, "6.4.0")) {
		const tableState = parsedState as TableState630;
		const { columns, tags, rows, cells } = tableState.model;

		const newState: TableState670 = {
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
		newState.model.headerRows = [];
		newState.model.headerRows.push(createHeaderRow());

		//Create body rows
		newState.model.bodyRows = rows
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
		newState.model.footerRows = [];
		newState.model.footerRows.push(createFooterRow());
		newState.model.footerRows.push(createFooterRow());

		//Update columns
		newState.model.columns = columns.map((column) => {
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
		newState.model.headerCells = cells
			.filter((cell) => cell.isHeader)
			.map((cell) => {
				return {
					id: cell.id,
					columnId: cell.columnId,
					rowId: newState.model.headerRows[0].id,
					markdown: cell.markdown,
				};
			});

		//Create body cells
		newState.model.bodyCells = cells
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
				newState.model.footerCells.push({
					id: uuidv4(),
					columnId: column.id,
					rowId: newState.model.footerRows[i].id,
					functionType: GeneralFunction670.NONE,
				});
			});
		}
		newState.model.tags = tags;
		currentState = newState;
	}

	//Feat: filter rules
	if (isVersionLessThan(pluginVersion, "6.8.0")) {
		const tableState = currentState as TableState670;
		const { model } = tableState;
		const { bodyCells, columns } = model;

		//Fix: clean up any bodyRows that were saved outside of the model
		const invalidState = currentState as Record<string, unknown>;
		if (invalidState.hasOwnProperty("bodyRows")) {
			delete invalidState.bodyRows;
		}

		//Feat: add filter rules
		const unknownModel = model as unknown;
		const typedModal = unknownModel as Record<string, unknown>;
		typedModal.filterRules = [];

		//Fix: set all checkbox cells to unchecked
		bodyCells.forEach((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumNotFoundError(cell.columnId);

			if (column.type === CellType.CHECKBOX) {
				if (cell.markdown === "") {
					cell.markdown = CHECKBOX_MARKDOWN_UNCHECKED;
				}
			}
		});
	}

	if (isVersionLessThan(pluginVersion, "6.9.1")) {
		const tableState = currentState as TableState680;
		const { footerCells } = tableState.model;

		//Feat: make all variable names consistent
		footerCells.forEach((cell: unknown) => {
			const typedCell = cell as Record<string, unknown>;
			if (typedCell.hasOwnProperty("functionType")) {
				typedCell.functionType = (
					typedCell.functionType as string
				).replace(/_/g, "-");
			}
		});
	}

	//Feat: support tag sorting
	if (isVersionLessThan(pluginVersion, "6.10.0")) {
		const tableState = currentState as TableState691;
		const { columns, tags, bodyCells, bodyRows } = tableState.model;

		//Migrate tags to the columns and cells
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.tags = [];
		});

		bodyCells.forEach((cell: unknown) => {
			const typedCell = cell as BodyCell;
			typedCell.tagIds = [];
		});

		tags.forEach((tag) => {
			const { id, columnId, markdown, color } = tag;
			const column: unknown | undefined = columns.find(
				(column) => column.id === columnId
			);
			if (!column) throw new ColumNotFoundError(columnId);

			const typedColumn = column as Column;
			typedColumn.tags.push({
				id,
				markdown,
				color,
			} as Tag);

			tag.cellIds.forEach((cellId) => {
				const cell: unknown | undefined = bodyCells.find(
					(cell) => cell.id === cellId
				);
				if (!cell) throw new CellIdError(cellId);

				const typedCell = cell as BodyCell;
				typedCell.tagIds.push(id);
			});
		});

		const unknownModel = tableState.model as unknown;
		const typedModel = unknownModel as Record<string, unknown>;
		delete typedModel.tags;

		//Delete unnecessary properties
		bodyRows.forEach((row: unknown) => {
			const typedRow = row as Record<string, unknown>;
			if (typedRow.hasOwnProperty("menuCellId")) {
				delete typedRow.menuCellId;
			}
		});
	}

	const tableState = currentState as TableState;
	tableState.pluginVersion = CURRENT_PLUGIN_VERSION;
	return tableState;
};
