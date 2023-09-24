import TagNotFoundError from "src/shared/error/tag-not-found-error";
import LoomStateCommand from "./loom-state-command";
import { Column, LoomState, Tag } from "../types/loom-state";

export default class TagUpdateCommand<
	K extends keyof Tag,
	V extends Tag[K]
> extends LoomStateCommand {
	private columnId: string;
	private tagId: string;
	private key: K;
	private value: V;

	/**
	 * The previous value of the tag before the command is executed
	 */
	private previousValue: unknown;

	constructor(columnId: string, tagId: string, key: K, value: V) {
		super(true);
		this.columnId = columnId;
		this.tagId = tagId;
		this.key = key;
		this.value = value;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		//TODO update last edited time
		const { columns } = prevState.model;
		const newColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				const tag = column.tags.find((tag) => tag.id === this.tagId);
				if (!tag) throw new TagNotFoundError(this.tagId);
				this.previousValue = tag[this.key];
				return {
					...column,
					tags: column.tags.map((tag) => {
						if (tag.id === this.tagId) {
							return {
								...tag,
								[this.key]: this.value,
							};
						}
						return tag;
					}),
				};
			}
			return column;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns } = prevState.model;

		const newColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					tags: column.tags.map((tag) => {
						if (tag.id === this.tagId) {
							return {
								...tag,
								[this.key]: this.previousValue,
							};
						}
						return tag;
					}),
				};
			}
			return column;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}
}
