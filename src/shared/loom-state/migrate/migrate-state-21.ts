import { type LoomState20, type LoomState21 } from "../types";
import { type Row } from "../types/loom-state";
import MigrateState from "./migrate-state";

/**
 * Migrates to 8.15.6
 */
export default class MigrateState21 implements MigrateState {
	public migrate(prevState: LoomState20): LoomState21 {
		const { rows } = prevState.model;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
				return {
					...cell,
					hasValidFrontmatter: null,
				};
			});
			return {
				...row,
				cells: nextCells,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}
}
