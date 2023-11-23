import { createTag } from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import {
	Cell,
	CellType,
	Column,
	LoomState,
	MultiTagCell,
	Row,
	Tag,
	TagCell,
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
	private targetRowId: string;

	/**
	 * The edited time of the row before the command is executed
	 */
	private originalLastEditedDateTime: string;

	/**
	 * The edited time of the row after the command is executed
	 *
	 */
	private updatedLastEditedDateTime: string;

	/**
	 * The tag that was added to the column
	 */
	private addedTag: Tag;

	/**
	 * The cell tag ids before the command is executed
	 */
	private originalCellTagIds: string[];

	/**
	 * The cell tag ids after the command is executed
	 */
	private updatedCellTagIds: string[];

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
		super.onExecute();

		const { rows, columns } = prevState.model;

		const row = rows.find((row) =>
			row.cells.find((cell) => cell.id === this.cellId)
		);
		if (!row) throw new RowNotFoundError();

		this.targetRowId = row.id;
		this.originalLastEditedDateTime = row.lastEditedDateTime;

		//Create a new tag
		const newTag = createTag(this.markdown, {
			color: this.color,
		});
		this.addedTag = newTag;

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
						const { tagId } = cell as TagCell;
						if (tagId) {
							this.originalCellTagIds = [tagId];
						} else {
							this.originalCellTagIds = [];
						}
						this.updatedCellTagIds = [newTag.id];

						return {
							...cell,
							tagId: newTag.id,
						};
					} else if (type === CellType.MULTI_TAG) {
						const { tagIds } = cell as MultiTagCell;
						this.originalCellTagIds = [...tagIds];
						this.updatedCellTagIds = [...tagIds, newTag.id];

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
			if (row.id === this.targetRowId) {
				const newLastEditedDateTime = getCurrentDateTime();
				this.updatedLastEditedDateTime = newLastEditedDateTime;
				return {
					...row,
					lastEditedDateTime: newLastEditedDateTime,
					cells: nextCells,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows, columns } = prevState.model;

		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					tags: column.tags.filter(
						(tag) => tag.id !== this.addedTag.id
					),
				};
			}
			return column;
		});

		const cellsToColumn = mapCellsToColumn(columns, rows);
		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
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
						throw new Error("Cell type is not tag or multi tag");
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
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		const { rows, columns } = prevState.model;

		const nextColumns = columns.map((column) => {
			if (column.id === this.columnId)
				return {
					...column,
					tags: [...column.tags, this.addedTag],
				};
			return column;
		});

		const cellsToColumn = mapCellsToColumn(columns, rows);

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
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
						throw new Error("Cell type is not tag or multi tag");
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
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}
}
