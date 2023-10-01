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

	private addedSourceFileColumn: Column | null = null;
	private addedSourceFileCells: AddedCell[] = [];

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
			const { addedCells, addedColumn, columns, rows } = result;

			this.addedSourceFileCells = addedCells;
			this.addedSourceFileColumn = addedColumn;
			nextColumns = columns;
			nextRows = rows;
		}

		const sourceColumn = columns.find(
			(column) => column.type === CellType.SOURCE
		);
		if (!sourceColumn) {
			const result = columnAddExecute(nextColumns, nextRows, {
				type: CellType.SOURCE,
				insertIndex: 0,
			});
			const { addedCells, addedColumn, columns, rows } = result;

			this.addedSourceCells = addedCells;
			this.addedSourceColumn = addedColumn;
			nextColumns = columns;
			nextRows = rows;
		}

		const newRows = findSourceRows(
			this.app,
			nextSources,
			nextColumns,
			nextRows
		);

		this.addedSourceRows = newRows;
		nextRows = [...nextRows, ...newRows];
		nextRows = filterUniqueRows(
			nextColumns,
			nextRows,
			CellType.SOURCE_FILE
		);

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

		if (this.addedSourceFileColumn !== null) {
			const result = columnAddUndo(
				nextColumns,
				nextRows,
				this.addedSourceFileColumn
			);
			const { columns, rows } = result;
			nextColumns = columns;
			nextRows = rows;
		}

		if (this.addedSourceColumn !== null) {
			const result = columnAddUndo(
				nextColumns,
				nextRows,
				this.addedSourceColumn
			);
			const { columns, rows } = result;
			nextColumns = columns;
			nextRows = rows;
		}

		nextRows = nextRows.filter(
			(row) => row.sourceId !== this.addedSource.id
		);

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

		if (this.addedSourceFileColumn !== null) {
			const result = columnAddRedo(
				nextColumns,
				nextRows,
				this.addedSourceFileColumn,
				this.addedSourceFileCells,
				{
					insertIndex: 0,
				}
			);
			const { columns, rows } = result;
			nextColumns = columns;
			nextRows = rows;
		}

		if (this.addedSourceColumn !== null) {
			const result = columnAddRedo(
				nextColumns,
				nextRows,
				this.addedSourceColumn,
				this.addedSourceCells,
				{
					insertIndex: 0,
				}
			);
			const { columns, rows } = result;
			nextColumns = columns;
			nextRows = rows;
		}

		nextRows = [...nextRows, ...this.addedSourceRows];
		nextRows = filterUniqueRows(
			nextColumns,
			nextRows,
			CellType.SOURCE_FILE
		);

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
