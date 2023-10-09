import MigrateState from "./migrate-state";
import { LoomState7 } from "../types/loom-state-7";
import {
	LoomState8,
	Column as Column8,
	FooterCell as FooterCell8,
} from "../types/loom-state-8";
import { cloneDeep } from "lodash";

/**
 * Migrates to 6.12.3
 */
export default class MigrateState7 implements MigrateState {
	public migrate(prevState: LoomState7): LoomState8 {
		const { columns, footerCells } = prevState.model;

		const nextColumns: Column8[] = columns.map((column) => {
			const footerCell = footerCells.find(
				(cell) => cell.columnId === column.id
			);
			if (!footerCell) throw new Error("Footer cell not found");
			return {
				...column,
				functionType: footerCell.functionType,
			};
		});

		const nextFooterCells: FooterCell8[] = footerCells.map((cell) => {
			const cellCopy: unknown = cloneDeep(cell);
			const unknownCell = cellCopy as Record<string, unknown>;
			if (unknownCell["functionType"]) {
				delete unknownCell.functionType;
			}
			return cell;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				footerCells: nextFooterCells,
			},
		};
	}
}
