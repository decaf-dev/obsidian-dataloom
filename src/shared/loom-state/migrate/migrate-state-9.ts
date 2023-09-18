import MigrateState from "./migrate-state";
import { SortDir } from "../types/loom-state";
import { LoomState10 } from "../types/loom-state-10";
import { LoomState9 } from "../types/loom-state-9";

/**
 * Migrates to 6.18.6
 */
export default class MigrateState9 implements MigrateState {
	public migrate(prevState: LoomState9): LoomState10 {
		const { columns, bodyRows } = prevState.model;

		const nextColumns = columns.map((column) => {
			//Fix: resolve empty rows being inserted but appearing higher up in the loom
			//This was due to the index being set to the row's position in the array, which
			//was sometimes less than the highest index value. This is because the index wasn't being
			//decreased.
			//This is a reset to force the index to be set to the correct value on all looms.
			return {
				...column,
				sortDir: SortDir.NONE,
			};
		});

		const bodyRowsCopy = structuredClone(bodyRows);
		//Sort by index
		bodyRowsCopy.sort((a, b) => a.index - b.index);

		const nextBodyRows = bodyRowsCopy.map((row, i) => {
			//Set the index to the correct value
			return {
				...row,
				index: i,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				bodyRows: nextBodyRows,
			},
		};
	}
}
