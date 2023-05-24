import { TagNotFoundError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { TableState, Tag } from "../types/types";

export default class TagUpdateCommand extends TableStateCommand {
	private columnId: string;
	private tagId: string;
	private key: keyof Tag;
	private value: unknown;

	/**
	 * The previous value of the tag before the command is executed
	 */
	private previousValue: unknown;

	constructor(
		columnId: string,
		tagId: string,
		key: keyof Tag,
		value: unknown
	) {
		super();
		this.columnId = columnId;
		this.tagId = tagId;
		this.key = key;
		this.value = value;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { columns } = prevState.model;
		const newColumns = columns.map((column) => {
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

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		const { columns } = prevState.model;

		const newColumns = columns.map((column) => {
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
}
