import MigrateState from "./migrate-state";
import { LoomState20, LoomState } from "../types";
import { Row } from "../types/loom-state";

/**
 * Migrates to 8.15.6
 */
export default class MigrateState21 implements MigrateState {
	public migrate(prevState: LoomState20): LoomState {
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
