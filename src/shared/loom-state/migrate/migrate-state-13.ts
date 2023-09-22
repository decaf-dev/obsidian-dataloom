import MigrateState from "./migrate-state";
import { LoomState } from "../types/loom-state";
import { LoomState13 } from "../types/loom-state-13";

/**
 * Migrates to 8.6.0
 */
export default class MigrateState12 implements MigrateState {
	public migrate(prevState: LoomState13): LoomState {
		const { settings, columns, headerCells, bodyCells, bodyRows, filters } =
			prevState.model;

		//Add showCalculationRow to settings
		const nextSettings = {
			...settings,
			showCalculationRow: true,
		};

		//Merge header cells into column
		const nextColumns = columns.map((column) => {
			const cell = headerCells.find(
				(cell) => cell.columnId === column.id
			);
			if (!cell) throw new Error("Header cell not found");
			const { markdown } = cell;
			return {
				...column,
				content: markdown,
			};
		});

		return {
			...prevState,
			model: {
				columns: nextColumns,
				bodyCells,
				bodyRows,
				filters,
				settings: nextSettings,
			},
		};
	}
}
