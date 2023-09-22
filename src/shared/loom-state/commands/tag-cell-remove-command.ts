import { rowLastEditedTime, rowLastEditedTimeUpdate } from "../row-utils";
import LoomStateCommand from "./loom-state-command";
import { LoomState } from "../types/loom-state";

export default class TagCellRemoveCommand extends LoomStateCommand {
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

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { bodyCells, rows } = prevState.model;

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
				rows: rowLastEditedTimeUpdate(
					rows,
					this.rowId,
					this.previousEditedTime
				),
			},
		};
	}
}
