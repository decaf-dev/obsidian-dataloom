import MigrateState from "./migrate-state";
import { LoomState, Tag } from "../types/loom-state";
import { LoomState13, BodyCell as BodyCell13 } from "../types/loom-state-13";

/**
 * Migrates to 8.6.0
 */
export default class MigrateState13 implements MigrateState {
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

		const nextRows = bodyRows.map((row) => {
			const cells: BodyCell13[] = bodyCells.filter(
				(cell) => cell.rowId === row.id
			);
			const nextCells = cells.map((cell) => {
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
