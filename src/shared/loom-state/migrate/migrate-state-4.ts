import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "src/shared/markdown/constants";
import { type LoomState4, CellType as CellType4 } from "../types/loom-state-4";
import {
	type BodyCell as BodyCell5,
	type LoomState5,
} from "../types/loom-state-5";
import MigrateState from "./migrate-state";

/**
 * Migrates to 6.8.0
 */
export default class MigrateState4 implements MigrateState {
	public migrate(prevState: LoomState4): LoomState5 {
		const { columns, bodyCells } = prevState.model;

		//Fix: set all checkbox cells to unchecked
		const nextBodyCells: BodyCell5[] = bodyCells.map((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumnNotFoundError({ id: cell.columnId });

			let markdown = cell.markdown;

			if (column.type === CellType4.CHECKBOX) {
				if (markdown === "") {
					markdown = CHECKBOX_MARKDOWN_UNCHECKED;
				}
			}

			return {
				...cell,
				markdown,
			};
		});

		return {
			model: {
				...prevState.model,
				bodyCells: nextBodyCells,
				filterRules: [],
			},
			pluginVersion: prevState.pluginVersion,
		};
	}
}
