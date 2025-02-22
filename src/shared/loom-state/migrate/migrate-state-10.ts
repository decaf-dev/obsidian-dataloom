import { cloneDeep } from "lodash";
import { type LoomState10 } from "../types/loom-state-10";
import {
	type BodyCell as BodyCell11,
	type Column as Column11,
	type LoomState11,
} from "../types/loom-state-11";
import MigrateState from "./migrate-state";

/**
 * Migrates to 6.19.0
 */
export default class MigrateState10 implements MigrateState {
	public migrate(prevState: LoomState10): LoomState11 {
		const { columns, bodyCells } = prevState.model;

		//Migrate from functionType to calculationType
		const nextColumns: Column11[] = columns.map((column) => {
			const columnCopy: unknown = cloneDeep(column);
			const unknownCopy = columnCopy as Record<string, unknown>;
			unknownCopy.calculationType = unknownCopy.functionType;
			delete unknownCopy.functionType;

			return columnCopy as Column11;
		});

		const nextBodyCells: BodyCell11[] = bodyCells.map((cell) => {
			return {
				...cell,
				isExternalLink: true,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				bodyCells: nextBodyCells,
			},
		};
	}
}
