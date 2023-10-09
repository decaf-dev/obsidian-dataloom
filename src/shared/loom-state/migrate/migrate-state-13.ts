import MigrateState from "./migrate-state";
import { Tag } from "../types/loom-state";
import { LoomState13, BodyCell as BodyCell13 } from "../types/loom-state-13";
import {
	LoomState14,
	TableSettings as Settings14,
	Column as Column14,
	Row as Row14,
	Cell as Cell14,
} from "../types/loom-state-14";

/**
 * Migrates to 8.6.0
 */
export default class MigrateState13 implements MigrateState {
	public migrate(prevState: LoomState13): LoomState14 {
		const { settings, columns, headerCells, bodyCells, bodyRows, filters } =
			prevState.model;

		//Add showCalculationRow to settings
		const nextSettings: Settings14 = {
			...settings,
			showCalculationRow: true,
		};

		//Merge header cells into column
		const nextColumns: Column14[] = columns.map((column) => {
			const cell = headerCells.find(
				(cell) => cell.columnId === column.id
			);
			if (!cell) throw new Error("Header cell not found");
			const { markdown } = cell;
			const { tags } = column;
			const nextTags: Tag[] = tags.map((tag) => {
				const { id, markdown, color } = tag;
				return {
					id,
					content: markdown,
					color,
				};
			});

			return {
				...column,
				content: markdown,
				tags: nextTags,
			};
		});

		const nextRows: Row14[] = bodyRows.map((row) => {
			const cells: BodyCell13[] = bodyCells.filter(
				(cell) => cell.rowId === row.id
			);
			const nextCells: Cell14[] = cells.map((cell) => {
				const {
					columnId,
					id,
					isExternalLink,
					dateTime,
					markdown,
					tagIds,
				} = cell;
				return {
					id,
					columnId,
					isExternalLink,
					dateTime,
					content: markdown,
					tagIds,
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
				columns: nextColumns,
				rows: nextRows,
				filters,
				settings: nextSettings,
			},
		};
	}
}
