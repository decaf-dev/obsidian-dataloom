import { cloneDeep } from "lodash";
import { type LoomState6 } from "../types/loom-state-6";
import type {
	BodyCell as BodyCell7,
	BodyRow as BodyRow7,
	Column as Column7,
	LoomState7,
} from "../types/loom-state-7";
import MigrateState from "./migrate-state";

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

		const nextColumns: Column7[] = columns.map((column) => {
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

		const nextBodyCells: BodyCell7[] = bodyCells.map((cell) => {
			const filteredTags = tags.filter((tag) =>
				tag.cellIds.includes(cell.id)
			);
			const nextTagIds = filteredTags.map((tag) => tag.id);
			return {
				...cell,
				tagIds: nextTagIds,
			};
		});

		const nextBodyRows: BodyRow7[] = bodyRows.map((row) => {
			const rowCopy: unknown = cloneDeep(row);
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
