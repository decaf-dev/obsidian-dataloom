import LoomStateCommand from "./loom-state-command";
import { Column, LoomState, Tag } from "../types/loom-state";

export default class TagUpdateCommand extends LoomStateCommand {
	private columnId: string;
	private tagId: string;
	private data: Partial<Tag>;
	private isPartial: boolean;

	constructor(
		columnId: string,
		tagId: string,
		data: Partial<Tag>,
		isPartial = true
	) {
		super(false);
		this.columnId = columnId;
		this.tagId = tagId;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		const { columns } = prevState.model;
		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				const { tags } = column;
				const nextTags: Tag[] = tags.map((tag) => {
					if (tag.id === this.tagId) {
						let newTag: Tag = this.data as Tag;
						if (this.isPartial)
							newTag = { ...tag, ...this.data } as Tag;
						return newTag;
					}
					return tag;
				});
				return { ...column, tags: nextTags };
			}
			return column;
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
