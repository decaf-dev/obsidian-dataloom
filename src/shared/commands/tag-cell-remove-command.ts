import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../dashboard-state/row-state-operations";
import DashboardStateCommand from "../dashboard-state/dashboard-state-command";
import { DashboardState } from "../types";

export default class TagCellRemoveCommand extends DashboardStateCommand {
	private cellId: string;
	private rowId: string;
	private tagId: string;

	private previousEditedTime: number;

	/**
	 * The index of the tag id in the tag ids array before the command is executed
	 */
	private previousTagIdIndex: number;

	constructor(cellId: string, rowId: string, tagId: string) {
		super(true);
		this.cellId = cellId;
		this.rowId = rowId;
		this.tagId = tagId;
	}

	execute(prevState: DashboardState): DashboardState {
		super.onExecute();

		const { bodyCells, bodyRows } = prevState.model;

		const newBodyCells = bodyCells.map((cell) => {
			if (cell.id === this.cellId) {
				this.previousTagIdIndex = cell.tagIds.indexOf(this.tagId);

				const { tagIds } = cell;
				return {
					...cell,
					tagIds: tagIds.filter((id) => id !== this.tagId),
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

	redo(prevState: DashboardState): DashboardState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: DashboardState): DashboardState {
		super.onUndo();
		const { bodyCells, bodyRows } = prevState.model;

		const newBodyCells = bodyCells.map((cell) => {
			if (cell.id === this.cellId) {
				const newTagIds = [...cell.tagIds];
				newTagIds.splice(this.previousTagIdIndex, 0, this.tagId);

				return {
					...cell,
					tagIds: newTagIds,
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
