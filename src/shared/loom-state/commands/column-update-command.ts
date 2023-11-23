import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import LoomStateCommand from "./loom-state-command";
import { Column, LoomState } from "../types/loom-state";

export default class ColumnUpdateCommand extends LoomStateCommand {
	private columnId: string;
	private data: Partial<Column>;
	private isPartial: boolean;

	constructor(
		columnId: string,
		data: Partial<Column>,
		options?: {
			isPartial?: boolean;
			shouldSortRows?: boolean;
			shouldSaveFrontmatter?: boolean;
		}
	) {
		const {
			shouldSortRows = false,
			isPartial = true,
			shouldSaveFrontmatter = true,
		} = options || {};

		super(shouldSortRows, { shouldSaveFrontmatter });
		this.columnId = columnId;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		const { columns } = prevState.model;
		const column = columns.find((column) => column.id === this.columnId);
		if (!column) throw new ColumnNotFoundError({ id: this.columnId });

		const nextColumns = columns.map((column) => {
			if (column.id === this.columnId) {
				let newColumn: Column = this.data as Column;
				if (this.isPartial)
					newColumn = { ...column, ...this.data } as Column;
				return newColumn;
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
		this.onExecute(prevState, nextState);
		return nextState;
	}
}
