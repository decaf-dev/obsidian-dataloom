import { cloneDeep } from "lodash";
import { createSource } from "../loom-state-factory";
import { LoomState } from "../types";
import { CellType, Column, Row, Source, SourceType } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";
import findSourceRows from "../source-rows";
import { App } from "obsidian";
import { filterUniqueRows } from "../row-utils";
import {
	columnAddExecute,
	columnAddRedo,
	columnAddUndo,
} from "./column-add-command/utils";
import { AddedCell } from "./column-add-command/types";

export default class SourceAddCommand extends LoomStateCommand {
	private app: App;
	private type: SourceType;
	private content: string;

	private addedSource: Source;
	private addedSourceColumn: Column | null = null;
	private addedSourceCells: AddedCell[] = [];

	private addedFileColumn: Column | null = null;
	private addedFileCells: AddedCell[] = [];

	private addedSourceRows: Row[] = [];

	constructor(app: App, type: SourceType, content: string) {
		super();
		this.app = app;
		this.type = type;
		this.content = content;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { sources, columns, rows } = prevState.model;
		let nextColumns = cloneDeep(columns);
		let nextRows = cloneDeep(rows);

		const newSource = createSource(this.type, this.content);
		this.addedSource = newSource;
		const nextSources = [...sources, newSource];

		const sourceFileColumn = columns.find(
			(column) => column.type === CellType.SOURCE_FILE
		);
		if (!sourceFileColumn) {
			const result = columnAddExecute(nextColumns, nextRows, {
				type: CellType.SOURCE_FILE,
				insertIndex: 0,
			});
			const {
				nextColumns: nextColumns1,
				nextRows: nextRows1,
				addedCells,
				addedColumn,
			} = result;
			this.addedSourceCells = addedCells;
			this.addedSourceColumn = addedColumn;
			nextColumns = nextColumns1;
			nextRows = nextRows1;
		}

		const sourceColumn = columns.find(
			(column) => column.type === CellType.SOURCE
		);
		if (!sourceColumn) {
			const result = columnAddExecute(nextColumns, nextRows, {
				type: CellType.SOURCE,
				insertIndex: 0,
			});
			const {
				nextColumns: nextColumns1,
				nextRows: nextRows1,
				addedCells,
				addedColumn,
			} = result;
			this.addedSourceCells = addedCells;
			this.addedSourceColumn = addedColumn;
			nextColumns = nextColumns1;
			nextRows = nextRows1;
		}

		const newRows = findSourceRows(
			this.app,
			nextSources,
			nextColumns,
			nextRows
		);
		this.addedSourceRows = newRows;
		nextRows = [...nextRows, ...newRows];
		nextRows = filterUniqueRows(nextColumns, nextRows);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				sources: nextSources,
				rows: nextRows,
			},
		};
	}
	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { sources, columns, rows } = prevState.model;

		let nextColumns = cloneDeep(columns);
		let nextRows = cloneDeep(rows);

		const nextSources = sources.filter(
			(source) => source.id !== this.addedSource.id
		);

		if (this.addedFileColumn !== null) {
			const result = columnAddUndo(
				nextColumns,
				nextRows,
				this.addedFileColumn
			);
			const { nextColumns: nextColumns1, nextRows: nextRows1 } = result;
			nextColumns = nextColumns1;
			nextRows = nextRows1;
		}

		if (this.addedSourceColumn !== null) {
			const result = columnAddUndo(
				nextColumns,
				nextRows,
				this.addedSourceColumn
			);
			const { nextColumns: nextColumns1, nextRows: nextRows1 } = result;
			nextColumns = nextColumns1;
			nextRows = nextRows1;
		}

		nextRows = rows.filter((row) => row.sourceId === this.addedSource.id);

		console.log(nextColumns);
		console.log(nextRows);

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}
	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { sources, columns, rows } = prevState.model;
		let nextRows = cloneDeep(rows);
		let nextColumns = cloneDeep(columns);

		const nextSources = [...sources, this.addedSource];

		if (this.addedFileColumn !== null) {
			const result = columnAddRedo(
				nextColumns,
				nextRows,
				this.addedFileColumn,
				this.addedFileCells
			);
			const { nextColumns: nextColumns1, nextRows: nextRows1 } = result;
			nextColumns = nextColumns1;
			nextRows = nextRows1;
		}

		if (this.addedSourceColumn !== null) {
			const result = columnAddRedo(
				nextColumns,
				nextRows,
				this.addedSourceColumn,
				this.addedSourceCells
			);
			const { nextColumns: nextColumns1, nextRows: nextRows1 } = result;
			nextColumns = nextColumns1;
			nextRows = nextRows1;
		}

		nextRows = [...nextRows, ...this.addedSourceRows];
		nextRows = filterUniqueRows(nextColumns, nextRows);

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}
}
