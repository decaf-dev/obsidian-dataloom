import { cloneDeep } from "lodash";
import { LoomState } from "../types";
import { CellType, Column, Source } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";
import {
	columnAddExecute,
	columnAddRedo,
	columnAddUndo,
} from "./column-add-command/utils";
import { AddedCell } from "./column-add-command/types";

export default class SourceAddCommand extends LoomStateCommand {
	private newSource: Source;

	private addedSourceColumn: Column | null = null;
	private addedSourceCells: AddedCell[] = [];

	private addedSourceFileColumn: Column | null = null;
	private addedSourceFileCells: AddedCell[] = [];

	constructor(source: Source) {
		super();
		this.newSource = source;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

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
				content: "Source",
				insertIndex: 0,
			});
			const { addedCells, addedColumn, columns, rows } = result;

			this.addedSourceCells = addedCells;
			this.addedSourceColumn = addedColumn;
			nextColumns = columns;
			nextRows = rows;
		}

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
			(source) => source.id !== this.newSource.id
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

		nextRows = nextRows.filter((row) => row.sourceId !== this.newSource.id);

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

		const nextSources = [...sources, this.newSource];

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
