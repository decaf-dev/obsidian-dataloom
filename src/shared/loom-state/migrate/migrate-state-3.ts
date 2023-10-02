import MigrateState from "./migrate-state";
import { LoomState3 } from "../types/loom-state-3";
import {
	LoomState4,
	HeaderRow as HeaderRow4,
	FooterRow as FooterRow4,
	GeneralFunction as GeneralFunction4,
	Column as Column4,
	HeaderCell as HeaderCell4,
	BodyRow as BodyRow4,
	BodyCell as BodyCell4,
	FooterCell as FooterCell4,
} from "../types/loom-state-4";
import { generateUuid } from "src/shared/uuid";

/**
 * Migrates to 6.4.0
 */
export default class MigrateState3 implements MigrateState {
	public migrate(prevState: LoomState3): LoomState4 {
		const { columns, rows, cells, tags } = prevState.model;

		const nextHeaderRows: HeaderRow4[] = [createHeaderRow()];

		const nextBodyRows: BodyRow4[] = rows
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

		const nextFooterRows: FooterRow4[] = [
			createFooterRow(),
			createFooterRow(),
		];

		//Update columns
		const nextColumns: Column4[] = columns.map((column) => {
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

		const nextHeaderCells: HeaderCell4[] = cells
			.filter((cell) => cell.isHeader)
			.map((cell) => {
				return {
					id: cell.id,
					columnId: cell.columnId,
					rowId: nextHeaderRows[0].id,
					markdown: cell.markdown,
				};
			});

		const nextBodyCells: BodyCell4[] = cells
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

		const nextFooterCells: FooterCell4[] = [];
		for (let i = 0; i < 2; i++) {
			columns.forEach((column) => {
				nextFooterCells.push({
					id: generateUuid(),
					columnId: column.id,
					rowId: nextFooterRows[i].id,
					functionType: GeneralFunction4.NONE,
				});
			});
		}

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				headerRows: nextHeaderRows,
				bodyRows: nextBodyRows,
				footerRows: nextFooterRows,
				headerCells: nextHeaderCells,
				bodyCells: nextBodyCells,
				footerCells: [],
				tags,
			},
		};
	}
}

const createHeaderRow = (): HeaderRow4 => {
	return {
		id: generateUuid(),
	};
};

const createFooterRow = (): FooterRow4 => {
	return {
		id: generateUuid(),
	};
};
