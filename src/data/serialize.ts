import {
	BodyCell,
	CellType,
	Column,
	SortDir,
	LoomState,
	Tag,
} from "../shared/loom-state/types";
import { LoomState630 } from "src/shared/loom-state/types/6.3.0";
import {
	GeneralFunction670,
	LoomState670,
} from "src/shared/loom-state/types/6.7.0";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import {
	createFooterRow,
	createHeaderRow,
} from "../shared/loom-state/loom-state-factory";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "src/shared/constants";
import { LoomState680 } from "src/shared/loom-state/types/6.8.0";
import { LoomState600 } from "src/shared/loom-state/types/6.0.0";
import {
	CurrencyType610,
	LoomState610,
} from "src/shared/loom-state/types/6.1.0";
import { DateFormat620, LoomState620 } from "src/shared/loom-state/types/6.2.0";
import { v4 as uuidv4 } from "uuid";
import { LoomState691 } from "src/shared/loom-state/types/6.9.1";
import {
	isVersionLessThan,
	legacyVersionToString,
} from "src/shared/versioning";
import { LoomState6122 } from "src/shared/loom-state/types/6.12.2";
import { LoomState6160 } from "src/shared/loom-state/types/6.16.0";
import { LoomState6186 } from "src/shared/loom-state/types/6.18.6";
import { DEFAULT_SETTINGS } from "src/main";

export const serializeLoomState = (state: LoomState): string => {
	return JSON.stringify(state, null, 2);
};

export const deserializeLoomState = (
	data: string,
	pluginVersion: string
): LoomState => {
	const parsedState = JSON.parse(data);

	const untypedVersion: unknown = parsedState["pluginVersion"];

	let versionString = "";
	if (typeof untypedVersion === "number") {
		versionString = legacyVersionToString(untypedVersion);
	} else if (typeof untypedVersion === "string") {
		versionString = untypedVersion;
	}

	let currentState: unknown = parsedState;

	if (isVersionLessThan(versionString, "6.1.0")) {
		const loomState = currentState as LoomState600;
		const { columns } = loomState.model;

		//Feat: Currency type
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.currencyType = CurrencyType610.UNITED_STATES;
		});
	}

	if (isVersionLessThan(versionString, "6.2.0")) {
		const loomState = currentState as LoomState610;
		const { columns } = loomState.model;

		//Feat: Date formats
		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.dateFormat = DateFormat620.YYYY_MM_DD;
		});
	}

	if (isVersionLessThan(versionString, "6.3.0")) {
		const loomState = currentState as LoomState620;
		const { columns, rows, cells } = loomState.model;

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

	//Feat: new loom state structure
	if (isVersionLessThan(versionString, "6.4.0")) {
		const loomState = parsedState as LoomState630;
		const { columns, tags, rows, cells } = loomState.model;

		const newState: LoomState670 = {
			...loomState,
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
	if (isVersionLessThan(versionString, "6.8.0")) {
		const loomState = currentState as LoomState670;
		const { model } = loomState;
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

	if (isVersionLessThan(versionString, "6.9.1")) {
		const loomState = currentState as LoomState680;
		const { footerCells } = loomState.model;

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
	if (isVersionLessThan(versionString, "6.10.0")) {
		const loomState = currentState as LoomState691;
		const { columns, tags, bodyCells, bodyRows } = loomState.model;

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
				//It seems that in older loom versions the cellIds array of tags wasn't being cleaned up
				//properly when a column, row, or cell was deleted. Therefore there will still be some
				//dangling cellIds in the tags array.
				if (!cell) return;

				const typedCell = cell as BodyCell;
				typedCell.tagIds.push(id);
			});
		});

		const unknownModel = loomState.model as unknown;
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

	if (isVersionLessThan(versionString, "6.12.3")) {
		const loomState = currentState as LoomState6122;
		const { columns, footerCells } = loomState.model;

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

	if (isVersionLessThan(versionString, "6.17.0")) {
		const loomState = currentState as LoomState6160;
		const { columns } = loomState.model;

		columns.forEach((column: unknown) => {
			const typedColumn = column as Record<string, unknown>;
			typedColumn.isLocked = false;
			typedColumn.aspectRatio = "unset";
			typedColumn.horizontalPadding = "unset";
			typedColumn.verticalPadding = "unset";
		});
	}

	if (isVersionLessThan(versionString, "6.18.6")) {
		const loomState = currentState as LoomState6160;
		const { columns, bodyRows } = loomState.model;

		//Fix: resolve empty rows being inserted but appearing higher up in the loom
		//This was due to the index being set to the row's position in the array, which
		//was sometimes less than the highest index value. This is because the index wasn't being
		//decreased.
		//This is a reset to force the index to be set to the correct value on all looms.
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

	if (isVersionLessThan(versionString, "6.19.0")) {
		const loomState = currentState as LoomState6186;
		const { columns, bodyCells } = loomState.model;

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

	if (isVersionLessThan(versionString, "8.2.0")) {
		const loomState = currentState as LoomState;
		const untypedModel = loomState.model as unknown;
		const typedModel = untypedModel as Record<string, unknown>;
		typedModel.settings = {
			numFrozenColumns: DEFAULT_SETTINGS.defaultFrozenColumnCount,
		};
	}

	const state = currentState as LoomState;
	state.pluginVersion = pluginVersion;
	return state;
};
