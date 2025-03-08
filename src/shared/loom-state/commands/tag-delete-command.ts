import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import TagNotFoundError from "src/shared/error/tag-not-found-error";
import {
	type Cell,
	CellType,
	type Column,
	type LoomState,
	type MultiTagCell,
	type Row,
	type TagCell,
} from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class TagDeleteCommand extends LoomStateCommand {
	private tagId: string;
	private columnId: string;

	constructor(columnId: string, tagId: string) {
		super(true);
		this.columnId = columnId;
		this.tagId = tagId;
	}

	execute(prevState: LoomState): LoomState {
		const { rows, columns } = prevState.model;

		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				const tag = column.tags.find((tag) => tag.id === this.tagId);
				if (!tag) throw new TagNotFoundError(this.tagId);

				const nextTags = column.tags.filter(
					(tag) => tag.id !== this.tagId
				);

				return {
					...column,
					tags: nextTags,
				};
			}
			return column;
		});

		const cellsToColumn = new Map<string, Column>();
		const cells = rows.flatMap((row) => row.cells);
		cells.forEach((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumnNotFoundError({ id: cell.columnId });
			cellsToColumn.set(cell.columnId, column);
		});

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				const column = cellsToColumn.get(cell.columnId);
				if (!column)
					throw new ColumnNotFoundError({ id: cell.columnId });

				const { type } = column;

				if (type === CellType.TAG) {
					const { tagId } = cell as TagCell;
					if (tagId === this.tagId) {
						return {
							...cell,
							tagId: null,
						};
					}
				} else if (type === CellType.MULTI_TAG) {
					const { tagIds } = cell as MultiTagCell;
					if (tagIds.includes(this.tagId)) {
						return {
							...cell,
							tagIds: tagIds.filter(
								(tagId) => tagId !== this.tagId
							),
						};
					}
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
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
