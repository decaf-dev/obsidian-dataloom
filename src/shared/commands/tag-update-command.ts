import { TagIdError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { TableState, Tag } from "../types/types";

export default class TagUpdateCommand extends TableStateCommand {
	private id: string;
	private key: keyof Tag;
	private value: unknown;

	private previousValue: unknown;

	constructor(id: string, key: keyof Tag, value: unknown) {
		super();
		this.id = id;
		this.key = key;
		this.value = value;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { tags } = prevState.model;
		const tag = tags.find((tag) => tag.id === this.id);
		if (!tag) throw new TagIdError(this.id);
		this.previousValue = tag[this.key];

		return {
			...prevState,
			model: {
				...prevState.model,
				tags: tags.map((tag) => {
					if (tag.id === this.id) {
						return {
							...tag,
							[this.key]: this.value,
						};
					}
					return tag;
				}),
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		const { tags } = prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				tags: tags.map((tag) => {
					if (tag.id === this.id) {
						return {
							...tag,
							[this.key]: this.previousValue,
						};
					}
					return tag;
				}),
			},
		};
	}
}
