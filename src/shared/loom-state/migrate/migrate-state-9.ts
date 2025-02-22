import { cloneDeep } from "lodash";
import { SortDir } from "../types/loom-state";
import {
	type BodyRow as BodyRow10,
	type Column as Column10,
	type LoomState10,
} from "../types/loom-state-10";
import { type LoomState9 } from "../types/loom-state-9";
import MigrateState from "./migrate-state";

/**
 * Migrates to 6.18.6
 */
export default class MigrateState9 implements MigrateState {
	public migrate(prevState: LoomState9): LoomState10 {
		const { columns, bodyRows } = prevState.model;

		const nextColumns: Column10[] = columns.map((column) => {
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

		const bodyRowsCopy = cloneDeep(bodyRows);
		//Sort by index
		bodyRowsCopy.sort((a, b) => a.index - b.index);

		const nextBodyRows: BodyRow10[] = bodyRowsCopy.map((row, i) => {
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
