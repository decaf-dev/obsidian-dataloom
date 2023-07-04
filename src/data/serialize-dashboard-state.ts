import { CURRENT_PLUGIN_VERSION } from "src/data/constants";
import {
	BodyCell,
	CellType,
	Column,
	SortDir,
	DashboardState,
	Tag,
} from "../shared/types";
import { DashboardState630 } from "src/shared/types/types-6.3.0";
import {
	GeneralFunction670,
	DashboardState670,
} from "src/shared/types/types-6.7.0";
import { ColumNotFoundError } from "../shared/dashboard-state/dashboard-error";
import { createFooterRow, createHeaderRow } from "./dashboard-state-factory";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "src/shared/dashboard-state/constants";
import { DashboardState680 } from "src/shared/types/types-6.8.0";
import { DashboardState600 } from "src/shared/types/types-6.0.0";
import {
	CurrencyType610,
	DashboardState610,
} from "src/shared/types/types-6.1.0";
import { DateFormat620, DashboardState620 } from "src/shared/types/types-6.2.0";
import { v4 as uuidv4 } from "uuid";
import { DashboardState691 } from "src/shared/types/types-6.9.1";
import {
	isVersionLessThan,
	legacyVersionToString,
} from "src/shared/versioning";
import { DashboardState6122 } from "src/shared/types/types-6.12.2";
import { DashboardState6160 } from "src/shared/types/types-6.16.0";
import { DashboardState6186 } from "src/shared/types/types-6.18.6";

export const serializeDashboardState = (
	dashboardState: DashboardState
): string => {
	return JSON.stringify(dashboardState, null, 2);
};

export const deserializeDashboardState = (data: string): DashboardState => {
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
		const dashboardState = currentState as DashboardState600;
		const { columns } = dashboardState.model;

		//Feat: Currency type
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.currencyType = CurrencyType610.UNITED_STATES;
		});
	}

	if (isVersionLessThan(pluginVersion, "6.2.0")) {
		const dashboardState = currentState as DashboardState610;
		const { columns } = dashboardState.model;

		//Feat: Date formats
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.dateFormat = DateFormat620.YYYY_MM_DD;
		});
	}

	if (isVersionLessThan(pluginVersion, "6.3.0")) {
		const dashboardState = currentState as DashboardState620;
		const { columns, rows, cells } = dashboardState.model;

		//Feat: Double click to resize
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			if (typedColumn["hasAutoWidth"]) {
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
		const dashboardState = parsedState as DashboardState630;
		const { columns, tags, rows, cells } = dashboardState.model;

		const newState: DashboardState670 = {
			...dashboardState,
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
		const dashboardState = currentState as DashboardState670;
		const { model } = dashboardState;
		const { bodyCells, columns } = model;

		//Fix: clean up any bodyRows that were saved outside of the model
		const invalidState = currentState as Record<string, unknown>;
		if (invalidState["bodyRows"]) {
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
		const dashboardState = currentState as DashboardState680;
		const { footerCells } = dashboardState.model;

		//Feat: make all variable names consistent
		footerCells.forEach((cell: unknown) => {
			const typedCell = cell as Record<string, unknown>;
			if (typedCell["functionType"]) {
				typedCell.functionType = (
					typedCell.functionType as string
				).replace(/_/g, "-");
			}
		});
	}

	//Feat: support tag sorting
	if (isVersionLessThan(pluginVersion, "6.10.0")) {
		const dashboardState = currentState as DashboardState691;
		const { columns, tags, bodyCells, bodyRows } = dashboardState.model;

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

				//If the cell doesn't exist, then don't migrate it
				//It seems that in older table versions the cellIds array of tags wasn't being cleaned up
				//properly when a column, row, or cell was deleted. Therefore there will still be some
				//dangling cellIds in the tags array.
				if (!cell) return;

				const typedCell = cell as BodyCell;
				typedCell.tagIds.push(id);
			});
		});

		const unknownModel = dashboardState.model as unknown;
		const typedModel = unknownModel as Record<string, unknown>;
		delete typedModel.tags;

		//Delete unnecessary properties
		bodyRows.forEach((row: unknown) => {
			const typedRow = row as Record<string, unknown>;
			if (typedRow["menuCellId"]) {
				delete typedRow.menuCellId;
			}
		});
	}

	if (isVersionLessThan(pluginVersion, "6.12.3")) {
		const dashboardState = currentState as DashboardState6122;
		const { columns, footerCells } = dashboardState.model;

		//Refactor: move function type into the column
		footerCells.forEach((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumNotFoundError(cell.columnId);

			const unknownColumn = column as unknown;
			const typedColumn = unknownColumn as Record<string, unknown>;
			typedColumn.functionType = cell.functionType;

			const unknownCell = cell as unknown;
			const typedCell = unknownCell as Record<string, unknown>;
			if (typedCell["functionType"]) {
				delete typedCell.functionType;
			}
		});
	}

	if (isVersionLessThan(pluginVersion, "6.17.0")) {
		const dashboardState = currentState as DashboardState6160;
		const { columns } = dashboardState.model;

		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.isLocked = false;
			typedColumn.aspectRatio = "unset";
			typedColumn.horizontalPadding = "unset";
			typedColumn.verticalPadding = "unset";
		});
	}

	if (isVersionLessThan(pluginVersion, "6.18.6")) {
		const dashboardState = currentState as DashboardState6160;
		const { columns, bodyRows } = dashboardState.model;

		//Fix: resolve empty rows being inserted but appearing higher up in the table
		//This was due to the index being set to the row's position in the array, which
		//was sometimes less than the highest index value. This is because the index wasn't being
		//decreased.
		//This is a reset to force the index to be set to the correct value on all tables.
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.sortDir = SortDir.NONE;
		});

		//Sort by index
		bodyRows.sort((a, b) => a.index - b.index);

		//Set the index to the correct value
		bodyRows.forEach((row: unknown, i) => {
			const typedRow = row as Record<string, unknown>;
			typedRow.index = i;
		});
	}

	if (isVersionLessThan(pluginVersion, "6.19.0")) {
		const dashboardState = currentState as DashboardState6186;
		const { columns, bodyCells } = dashboardState.model;

		//Migrate from functionType to calculationType
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.calculationType = typedColumn.functionType;

			if (typedColumn["functionType"]) delete typedColumn.functionType;
		});

		//Migrate from functionType to calculationType
		bodyCells.forEach((cell: unknown) => {
			const typedCell = cell as Record<string, unknown>;
			typedCell.isExternalLink = true;
		});
	}

	const dashboardState = currentState as DashboardState;
	dashboardState.pluginVersion = CURRENT_PLUGIN_VERSION;
	return dashboardState;
};
