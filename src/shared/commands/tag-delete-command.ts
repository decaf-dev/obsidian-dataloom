import TableStateCommand from "../table-state/table-state-command";
import { TableState, Tag } from "../table-state/types";
import { TagIdError } from "../table-state/table-error";
import { CommandUndoError } from "./command-errors";

export default class TagDeleteCommand extends TableStateCommand {
	id: string;
	deletedTag?: {
		arrIndex: number;
		tag: Tag;
	};

	constructor(id: string) {
		super();
		this.id = id;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { tags } = prevState.model;
		const tag = tags.find((tag) => tag.id === this.id);
		if (!tag) throw new TagIdError(this.id);

		this.deletedTag = {
			arrIndex: tags.indexOf(tag),
			tag,
		};

		return {
			...prevState,
			model: {
				...prevState.model,
				tags: tags.filter((tag) => tag.id !== this.id),
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		if (this.deletedTag === undefined) throw new CommandUndoError();
		const { tags } = prevState.model;

		const updatedTags = [...tags];
		updatedTags.splice(this.deletedTag.arrIndex, 0, this.deletedTag.tag);

		return {
			...prevState,
			model: {
				...prevState.model,
				tags: updatedTags,
			},
		};
	}
}
