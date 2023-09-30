import { cloneDeep } from "lodash";
import { LoomState } from "../types";
import { CellType, Column, Filter, Row, Source } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import {
	columnDeleteExecute,
	columnDeleteUndo,
} from "./column-delete-command/utils";
import {
	DeletedCell,
	DeletedColumn,
	DeletedFilter,
} from "./column-delete-command/types";

export default class SourceDeleteCommand extends LoomStateCommand {
	private deletedSource: {
		arrIndex: number;
		source: Source;
	};
	private deletedRows: {
		arrIndex: number;
		row: Row;
	}[] = [];

	private id: string;

	private deletedSourceColumn: {
		deletedCells: DeletedCell[];
		deletedColumn: DeletedColumn;
		deletedFilters: DeletedFilter[];
	};

	private deletedFileColumn: {
		deletedCells: DeletedCell[];
		deletedColumn: DeletedColumn;
		deletedFilters: DeletedFilter[];
	};

	constructor(id: string) {
		super();
		this.id = id;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { sources, rows, columns, filters } = prevState.model;

		//Setup copies
		let nextColumns: Column[] = cloneDeep(columns);
		let nextRows: Row[] = cloneDeep(rows);
		let nextFilters: Filter[] = cloneDeep(filters);

		//Delete source column
		const sourceColumn = columns.find(
			(column) => column.type === CellType.SOURCE
		);
		if (!sourceColumn)
			throw new ColumnNotFoundError({ type: CellType.SOURCE });

		const result1 = columnDeleteExecute(
			columns,
			rows,
			filters,
			sourceColumn.id
		);
		if (result1 === null) {
			throw new Error("Cannot delete source column");
		}

		const {
			nextColumns: nextColumns1,
			nextFilters: nextFilters1,
			nextRows: nextRows1,
			deletedCells: deletedCells1,
			deletedColumn: deletedColumn1,
			deletedFilters: deletedFilters1,
		} = result1;
		nextRows = nextRows1;
		nextColumns = nextColumns1;
		nextFilters = nextFilters1;

		this.deletedSourceColumn = {
			deletedCells: deletedCells1,
			deletedColumn: deletedColumn1,
			deletedFilters: deletedFilters1,
		};

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
			nextFilters: nextFilters2,
			nextRows: nextRows2,
			deletedCells: deletedCells2,
			deletedColumn: deletedColumn2,
			deletedFilters: deletedFilters2,
		} = result2;

		nextRows = nextRows2;
		nextColumns = nextColumns2;
		nextFilters = nextFilters2;

		this.deletedFileColumn = {
			deletedCells: deletedCells2,
			deletedColumn: deletedColumn2,
			deletedFilters: deletedFilters2,
		};

		const nextSources: Source[] = sources.filter((source) => {
			if (source.id === this.id) {
				this.deletedSource = {
					arrIndex: sources.indexOf(source),
					source: cloneDeep(source),
				};
				return false;
			}
			return true;
		});

		nextRows = nextRows.filter((row) => {
			const { sourceId } = row;
			if (sourceId === this.id) {
				this.deletedRows.push({
					arrIndex: rows.indexOf(row),
					row: cloneDeep(row),
				});
				return false;
			}
			return true;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
				rows: nextRows,
				columns: nextColumns,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { sources, rows, columns, filters } = prevState.model;

		let nextColumns: Column[];
		let nextRows: Row[];
		let nextFilters: Filter[];

		//Undo source column deletion
		const result1 = columnDeleteUndo(
			columns,
			rows,
			filters,
			this.deletedSourceColumn.deletedColumn,
			this.deletedSourceColumn.deletedCells,
			this.deletedSourceColumn.deletedFilters
		);
		const {
			nextColumns: nextColumns1,
			nextRows: nextRows1,
			nextFilters: nextFilters1,
		} = result1;

		nextColumns = nextColumns1;
		nextRows = nextRows1;
		nextFilters = nextFilters1;

		//Undo file column deletion
		const result2 = columnDeleteUndo(
			nextColumns,
			nextRows,
			nextFilters,
			this.deletedFileColumn.deletedColumn,
			this.deletedFileColumn.deletedCells,
			this.deletedFileColumn.deletedFilters
		);
		const {
			nextColumns: nextColumns2,
			nextRows: nextRows2,
			nextFilters: nextFilters2,
		} = result2;
		nextColumns = nextColumns2;
		nextRows = nextRows2;
		nextFilters = nextFilters2;

		//Undo source deletion
		const nextSources: Source[] = [...sources];
		nextSources.splice(
			this.deletedSource.arrIndex,
			0,
			this.deletedSource.source
		);

		//Undo row deletion
		this.deletedRows.forEach(({ arrIndex, row }) => {
			nextRows.splice(arrIndex, 0, row);
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
				rows: nextRows,
				columns: nextColumns,
				filters: nextFilters,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}
}
