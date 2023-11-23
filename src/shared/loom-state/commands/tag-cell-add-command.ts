import LoomStateCommand from "./loom-state-command";
import {
	Cell,
	CellType,
	LoomState,
	MultiTagCell,
	Row,
} from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import { getCurrentDateTime } from "src/shared/date/utils";
import { mapCellsToColumn } from "../utils/column-utils";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";

export default class TagCellAddCommand extends LoomStateCommand {
	private cellId: string;
	private tagId: string;

	constructor(cellId: string, tagId: string) {
		super(true);
		this.cellId = cellId;
		this.tagId = tagId;
	}

	execute(prevState: LoomState): LoomState {
		const { rows, columns } = prevState.model;
		const row = rows.find((row) =>
			row.cells.find((cell) => cell.id === this.cellId)
		);
		if (!row) throw new RowNotFoundError();

		const targetRowId = row.id;

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
							tagId: this.tagId,
						};
					} else if (type === CellType.MULTI_TAG) {
						const { tagIds } = cell as MultiTagCell;
						return {
							...cell,
							tagIds: [...tagIds, this.tagId],
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

		const newState = {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
		this.onExecute(prevState, newState);
		return newState;
	}
}
