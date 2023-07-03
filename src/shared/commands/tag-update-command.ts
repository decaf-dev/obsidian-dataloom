import { TagNotFoundError } from "../dashboard-state/dashboard-error";
import DashboardStateCommand from "../dashboard-state/table-state-command";
import { DashboardState, Tag } from "../types";

export default class TagUpdateCommand extends DashboardStateCommand {
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
		super(true);
		this.columnId = columnId;
		this.tagId = tagId;
		this.key = key;
		this.value = value;
	}

	execute(prevState: DashboardState): DashboardState {
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

	redo(prevState: DashboardState): DashboardState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: DashboardState): DashboardState {
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
