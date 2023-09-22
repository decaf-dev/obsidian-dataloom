import { rowLastEditedTime, rowLastEditedTimeUpdate } from "../row-utils";
import LoomStateCommand from "./loom-state-command";
import { LoomState } from "../types/loom-state";

export default class TagCellMultipleRemoveCommand extends LoomStateCommand {
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

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { bodyCells, rows } = prevState.model;

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

		this.previousEditedTime = rowLastEditedTime(rows, this.rowId);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: newBodyCells,
				rows: rowLastEditedTimeUpdate(rows, this.rowId),
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();
		const { bodyCells, rows } = prevState.model;

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
				rows: rowLastEditedTimeUpdate(
					rows,
					this.rowId,
					this.previousEditedTime
				),
			},
		};
	}
}
