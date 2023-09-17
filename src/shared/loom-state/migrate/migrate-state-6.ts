import MigrateState from "./migrate-state";
import { LoomState6 } from "../types/loom-state-6";
import { LoomState7, BodyRow as BodyRow7 } from "../types/loom-state-7";

/**
 * Migrates to 6.10.0
 */
export default class MigrateState6 implements MigrateState {
	public migrate(prevState: LoomState6): LoomState7 {
		const {
			columns,
			tags,
			bodyCells,
			bodyRows,
			headerCells,
			headerRows,
			footerRows,
			footerCells,
			filterRules,
		} = prevState.model;

		const nextColumns = columns.map((column) => {
			const filteredTags = tags.filter(
				(tag) => tag.columnId === column.id
			);
			const nextTags = filteredTags.map((tag) => {
				return {
					id: tag.id,
					markdown: tag.markdown,
					color: tag.color,
				};
			});

			return {
				...column,
				tags: nextTags,
			};
		});

		const nextBodyCells = bodyCells.map((cell) => {
			const filteredTags = tags.filter((tag) =>
				tag.cellIds.includes(cell.id)
			);
			const nextTagIds = filteredTags.map((tag) => tag.id);
			return {
				...cell,
				tagIds: nextTagIds,
			};
		});

		const nextBodyRows = bodyRows.map((row) => {
			const rowCopy: unknown = structuredClone(row);
			const unknownRow = rowCopy as Record<string, unknown>;

			//Remove old property
			if (unknownRow["menuCellId"]) {
				delete unknownRow.menuCellId;
			}
			return rowCopy as BodyRow7;
		});

		return {
			...prevState,
			model: {
				columns: nextColumns,
				headerRows,
				bodyRows: nextBodyRows,
				footerRows,
				headerCells,
				bodyCells: nextBodyCells,
				footerCells,
				filterRules,
			},
		};
	}
}
