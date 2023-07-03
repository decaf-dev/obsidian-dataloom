import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../dashboard-state/row-state-operations";
import DashboardStateCommand from "../dashboard-state/dashboard-state-command";
import { DashboardState } from "../types";

export default class TagCellAddCommand extends DashboardStateCommand {
	private cellId: string;
	private rowId: string;
	private tagId: string;
	private isMultiTag: boolean;

	constructor(
		cellId: string,
		rowId: string,
		tagId: string,
		isMultiTag: boolean
	) {
		super(true);
		this.cellId = cellId;
		this.rowId = rowId;
		this.tagId = tagId;
		this.isMultiTag = isMultiTag;
	}

	private previousCellTagIds: string[];
	private previousEditedTime: number;

	execute(prevState: DashboardState): DashboardState {
		super.onExecute();

		const { bodyCells, bodyRows } = prevState.model;

		const newBodyCells = bodyCells.map((cell) => {
			if (cell.id === this.cellId) {
				this.previousCellTagIds = [...cell.tagIds];

				if (this.isMultiTag === false) {
					//If there was already a tag attached to the cell, remove it
					if (cell.tagIds.length > 0) {
						return {
							...cell,
							tagIds: [this.tagId],
						};
					}
				}
				return {
					...cell,
					tagIds: [...cell.tagIds, this.tagId],
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
				return {
					...cell,
					tagIds: this.previousCellTagIds,
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
