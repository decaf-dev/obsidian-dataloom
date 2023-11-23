import { createTag } from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import {
	Cell,
	CellType,
	Column,
	LoomState,
	MultiTagCell,
	Row,
} from "../types/loom-state";
import { Color } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import { getCurrentDateTime } from "src/shared/date/utils";
import { mapCellsToColumn } from "../utils/column-utils";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";

/**
 * Adds a tag to a cell
 */
export default class TagAddCommand extends LoomStateCommand {
	private cellId: string;
	private columnId: string;
	private markdown: string;
	private color: Color;

	constructor(
		cellId: string,
		columnId: string,
		markdown: string,
		color: Color
	) {
		super(true);
		this.cellId = cellId;
		this.columnId = columnId;
		this.markdown = markdown;
		this.color = color;
	}

	execute(prevState: LoomState): LoomState {
		const { rows, columns } = prevState.model;

		const row = rows.find((row) =>
			row.cells.find((cell) => cell.id === this.cellId)
		);
		if (!row) throw new RowNotFoundError();

		const targetRowId = row.id;

		//Create a new tag
		const newTag = createTag(this.markdown, {
			color: this.color,
		});

		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					tags: [...column.tags, newTag],
				};
			}
			return column;
		});

		const cellsToColumn = mapCellsToColumn(columns, rows);
		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				const { id } = cell;

				if (id === this.cellId) {
					const column = cellsToColumn.get(cell.columnId);
					if (!column)
						throw new ColumnNotFoundError({
							id: cell.columnId,
						});

					const { type } = column;
					if (type === CellType.TAG) {
						return {
							...cell,
							tagId: newTag.id,
						};
					} else if (type === CellType.MULTI_TAG) {
						const { tagIds } = cell as MultiTagCell;

						return {
							...cell,
							tagIds: [...tagIds, newTag.id],
						};
					} else {
						throw new Error("Cell type is not a tag or multi tag");
					}
				}
				return cell;
			});
			if (row.id === targetRowId) {
				return {
					...row,
					lastEditedDateTime: getCurrentDateTime(),
					cells: nextCells,
				};
			}
			return row;
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
