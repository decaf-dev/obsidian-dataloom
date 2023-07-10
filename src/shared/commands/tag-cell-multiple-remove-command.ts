import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../table-state/row-state-operations";
import TableStateCommand from "../table-state/dashboard-state-command";
import { TableState } from "../types";

export default class TagCellMultipleRemoveCommand extends TableStateCommand {
	private cellId: string;
	private rowId: string;
	private tagIds: string[];

	private previousEditedTime: number;

	private previousTagIds: string[];

	constructor(cellId: string, rowId: string, tagIds: string[]) {
		super(true);
		this.cellId = cellId;
		this.rowId = rowId;
		this.tagIds = tagIds;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { bodyCells, bodyRows } = prevState.model;

		const newBodyCells = bodyCells.map((cell) => {
			if (cell.id === this.cellId) {
				this.previousTagIds = [...cell.tagIds];

				return {
					...cell,
					tagIds: cell.tagIds.filter(
						(id) => !this.tagIds.includes(id)
					),
				};
			}
			return cell;
		});

		this.previousEditedTime = rowLastEditedTime(bodyRows, this.rowId);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: newBodyCells,
				bodyRows: rowLastEditedTimeUpdate(bodyRows, this.rowId),
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();
		const { bodyCells, bodyRows } = prevState.model;

		const newBodyCells = bodyCells.map((cell) => {
			if (cell.id === this.cellId) {
				return {
					...cell,
					tagIds: this.previousTagIds,
				};
			}
			return cell;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: newBodyCells,
				bodyRows: rowLastEditedTimeUpdate(
					bodyRows,
					this.rowId,
					this.previousEditedTime
				),
			},
		};
	}
}
