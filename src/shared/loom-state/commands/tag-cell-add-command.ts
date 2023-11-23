import LoomStateCommand from "./loom-state-command";
import {
	Cell,
	CellType,
	LoomState,
	MultiTagCell,
	Row,
	TagCell,
} from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import { getCurrentDateTime } from "src/shared/date/utils";
import { mapCellsToColumn } from "../utils/column-utils";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";

export default class TagCellAddCommand extends LoomStateCommand {
	private cellId: string;
	private tagId: string;

	private targetRowId: string;

	private originalCellTagIds: string[];
	private updatedCellTagIds: string[];

	private originalLastEditedDateTime: string;
	private updatedLastEditedDateTime: string;

	constructor(cellId: string, tagId: string) {
		super(true);
		this.cellId = cellId;
		this.tagId = tagId;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { rows, columns } = prevState.model;
		const row = rows.find((row) =>
			row.cells.find((cell) => cell.id === this.cellId)
		);
		if (!row) throw new RowNotFoundError();

		this.targetRowId = row.id;
		this.originalLastEditedDateTime = row.lastEditedDateTime;

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
						const { tagId } = cell as TagCell;
						if (tagId) {
							this.originalCellTagIds = [tagId];
						} else {
							this.originalCellTagIds = [];
						}
						this.updatedCellTagIds = [this.tagId];

						return {
							...cell,
							tagId: this.tagId,
						};
					} else if (type === CellType.MULTI_TAG) {
						const { tagIds } = cell as MultiTagCell;
						this.originalCellTagIds = [...tagIds];
						this.updatedCellTagIds = [...tagIds, this.tagId];

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

			if (row.id === this.targetRowId) {
				const newLastEditedTime = getCurrentDateTime();
				this.updatedLastEditedDateTime = newLastEditedTime;
				return {
					...row,
					lastEditedDateTime: newLastEditedTime,
					cells: nextCells,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, rows } = prevState.model;

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
							tagId:
								this.originalCellTagIds.length !== 0
									? this.originalCellTagIds[0]
									: null,
						};
					} else if (type === CellType.MULTI_TAG) {
						return {
							...cell,
							tagIds: this.originalCellTagIds,
						};
					} else {
						throw new Error("Cell type is not a tag or multi tag");
					}
				}
				return cell;
			});

			if (row.id === this.targetRowId) {
				return {
					...row,
					lastEditedDateTime: this.originalLastEditedDateTime,
					cells: nextCells,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { columns, rows } = prevState.model;

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
							tagId:
								this.updatedCellTagIds.length !== 0
									? this.updatedCellTagIds[0]
									: null,
						};
					} else if (type === CellType.MULTI_TAG) {
						return {
							...cell,
							tagIds: this.updatedCellTagIds,
						};
					} else {
						throw new Error("Cell type is not a tag or multi tag");
					}
				}
				return cell;
			});

			if (row.id === this.targetRowId) {
				return {
					...row,
					lastEditedDateTime: this.updatedLastEditedDateTime,
					cells: nextCells,
				};
			}
			return row;
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
