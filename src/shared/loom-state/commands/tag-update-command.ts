import LoomStateCommand from "./loom-state-command";
import { Column, LoomState, Tag } from "../types/loom-state";
import { cloneDeep } from "lodash";

export default class TagUpdateCommand extends LoomStateCommand {
	private columnId: string;
	private tagId: string;
	private data: Partial<Tag>;
	private isPartial: boolean;

	private prevTag: Tag;
	private nextTag: Tag;

	constructor(
		columnId: string,
		tagId: string,
		data: Partial<Tag>,
		isPartial = true
	) {
		super();
		this.columnId = columnId;
		this.tagId = tagId;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns } = prevState.model;
		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				const { tags } = column;
				const nextTags: Tag[] = tags.map((tag) => {
					if (tag.id === this.tagId) {
						this.prevTag = cloneDeep(tag);

						let newTag: Tag = this.data as Tag;
						if (this.isPartial)
							newTag = { ...tag, ...this.data } as Tag;
						this.nextTag = newTag;
						return newTag;
					}
					return tag;
				});
				return { ...column, tags: nextTags };
			}
			return column;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns } = prevState.model;
		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				const { tags } = column;
				const nextTags: Tag[] = tags.map((tag) => {
					if (tag.id === this.nextTag.id) {
						return this.prevTag;
					}
					return tag;
				});
				return { ...column, tags: nextTags };
			}
			return column;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { columns } = prevState.model;
		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				const { tags } = column;
				const nextTags: Tag[] = tags.map((tag) => {
					if (tag.id === this.tagId) {
						return this.nextTag;
					}
					return tag;
				});
				return { ...column, tags: nextTags };
			}
			return column;
		});
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
	}
}
