import MigrateState from "./migrate-state";
import { LoomState10 } from "../types/loom-state-10";
import { LoomState11, Column as Column11 } from "../types/loom-state-11";

/**
 * Migrates to 6.19.0
 */
export default class MigrateState10 implements MigrateState {
	public migrate(prevState: LoomState10): LoomState11 {
		const { columns, bodyCells } = prevState.model;

		//Migrate from functionType to calculationType
		const nextColumns = columns.map((column) => {
			const columnCopy: unknown = structuredClone(column);
			const unknownCopy = columnCopy as Record<string, unknown>;
			unknownCopy.calculationType = unknownCopy.functionType;
			delete unknownCopy.functionType;

			return columnCopy as Column11;
		});

		const nextBodyCells = bodyCells.map((cell) => {
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
