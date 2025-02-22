import { cloneDeep } from "lodash";
import type { LoomState } from "../types";
import { CellType, type Source } from "../types/loom-state";
import { columnAddExecute } from "./column-add-command/utils";
import LoomStateCommand from "./loom-state-command";

export default class SourceAddCommand extends LoomStateCommand {
	private newSource: Source;

	constructor(source: Source) {
		super(false);
		this.newSource = source;
	}

	execute(prevState: LoomState): LoomState {
		const { sources, columns, rows } = prevState.model;
		let nextColumns = cloneDeep(columns);
		let nextRows = cloneDeep(rows);

		const nextSources = [...sources, this.newSource];

		const sourceFileColumn = columns.find(
			(column) => column.type === CellType.SOURCE_FILE
		);
		if (!sourceFileColumn) {
			const result = columnAddExecute(nextColumns, nextRows, {
				type: CellType.SOURCE_FILE,
				content: "Source File",
				insertIndex: 0,
			});
			const { columns, rows } = result;
			nextColumns = columns;
			nextRows = rows;
		}

		const sourceColumn = columns.find(
			(column) => column.type === CellType.SOURCE
		);
		if (!sourceColumn) {
			const result = columnAddExecute(nextColumns, nextRows, {
				type: CellType.SOURCE,
				content: "Source",
				insertIndex: 0,
			});
			const { columns, rows } = result;
			nextColumns = columns;
			nextRows = rows;
		}

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				sources: nextSources,
				rows: nextRows,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
