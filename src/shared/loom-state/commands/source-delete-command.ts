import { cloneDeep } from "lodash";
import { LoomState } from "../types";
import { CellType, Column, Filter, Row, Source } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import { columnDeleteExecute } from "./column-delete-command/utils";

export default class SourceDeleteCommand extends LoomStateCommand {
	private id: string;

	constructor(id: string) {
		super(false);
		this.id = id;
	}

	execute(prevState: LoomState): LoomState {
		const { sources, rows, columns, filters } = prevState.model;

		//Setup copies
		let nextColumns: Column[] = cloneDeep(columns);
		let nextRows: Row[] = cloneDeep(rows);
		let nextFilters: Filter[] = cloneDeep(filters);

		const isLastSource = sources.length === 1;

		//Only delete columns if its the last source
		if (isLastSource) {
			//Delete source column
			const sourceColumn = nextColumns.find(
				(column) => column.type === CellType.SOURCE
			);
			if (!sourceColumn)
				throw new ColumnNotFoundError({ type: CellType.SOURCE });

			const result1 = columnDeleteExecute(
				nextColumns,
				nextRows,
				nextFilters,
				sourceColumn.id
			);
			if (result1 === null) {
				throw new Error("Cannot delete source column");
			}

			const {
				nextColumns: nextColumns1,
				nextFilters: nextFilters1,
				nextRows: nextRows1,
			} = result1;
			nextRows = nextRows1;
			nextColumns = nextColumns1;
			nextFilters = nextFilters1;

			//Delete source file column
			const sourceFileColumn = columns.find(
				(column) => column.type === CellType.SOURCE_FILE
			);
			if (!sourceFileColumn)
				throw new ColumnNotFoundError({ type: CellType.FILE });

			const result2 = columnDeleteExecute(
				nextColumns,
				nextRows,
				nextFilters,
				sourceFileColumn.id
			);
			if (result2 === null) {
				throw new Error("Cannot delete source file column");
			}

			const {
				nextColumns: nextColumns2,
				nextRows: nextRows2,
				nextFilters: nextFilters2,
			} = result2;

			nextColumns = nextColumns2;
			nextRows = nextRows2;
			nextFilters = nextFilters2;
		}

		const nextSources: Source[] = sources.filter((source) => {
			if (source.id === this.id) return false;
			return true;
		});

		nextRows = nextRows.filter((row) => {
			const { sourceId } = row;
			if (sourceId === this.id) {
				return false;
			}
			return true;
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
				rows: nextRows,
				columns: nextColumns,
				filters: nextFilters,
			},
		};
		this.onExecute(prevState, nextState);
		return nextState;
	}
}
