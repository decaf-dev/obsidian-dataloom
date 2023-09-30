import { cloneDeep } from "lodash";
import { createCell, createColumn, createSource } from "../loom-state-factory";
import { LoomState } from "../types";
import {
	Cell,
	CellType,
	Column,
	Row,
	Source,
	SourceType,
} from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import findSourceRows from "../source-rows";
import { App } from "obsidian";
import { filterUniqueRows } from "../row-utils";

export default class SourceAddCommand extends LoomStateCommand {
	private app: App;
	private type: SourceType;
	private content: string;

	private addedSource: Source;
	private addedSourceColumn: Column | null;
	private addedSourceCells: {
		rowId: string;
		cell: Cell;
	}[] = [];

	private addedFileColumn: Column | null;
	private addedFileCells: {
		rowId: string;
		cell: Cell;
	}[] = [];

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

		const newSource = createSource(this.type, this.content);
		this.addedSource = newSource;
		const nextSources = [...sources, newSource];

		const nextColumns = cloneDeep(columns);
		let nextRows = cloneDeep(rows);
		const sourceFileColumn = columns.find(
			(column) => column.type === CellType.SOURCE_FILE
		);
		if (!sourceFileColumn) {
			const newColumn = createColumn({
				cellType: CellType.SOURCE_FILE,
				content: "Source File",
			});
			this.addedFileColumn = newColumn;
			nextColumns.unshift(newColumn);

			nextRows = nextRows.map((row) => {
				const newCell = createCell(newColumn.id, {
					cellType: CellType.SOURCE_FILE,
				});
				this.addedFileCells.push({
					rowId: row.id,
					cell: newCell,
				});

				row.cells.unshift(newCell);
				return row;
			});
		}

		const sourceColumn = columns.find(
			(column) => column.type === CellType.SOURCE
		);
		if (!sourceColumn) {
			const newColumn = createColumn({
				cellType: CellType.SOURCE,
				content: "Source",
			});
			this.addedSourceColumn = newColumn;
			nextColumns.unshift(newColumn);

			nextRows = nextRows.map((row) => {
				const newCell = createCell(newColumn.id, {
					cellType: CellType.SOURCE,
					content: "",
				});
				this.addedSourceCells.push({
					rowId: row.id,
					cell: newCell,
				});
				row.cells.unshift(newCell);
				return row;
			});
		}

		const newRows = findSourceRows(
			this.app,
			nextSources,
			columns,
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

		const nextSources = sources.filter(
			(source) => source.id !== this.addedSource.id
		);

		let nextColumns = cloneDeep(columns);
		if (this.addedFileColumn !== null) {
			const id = this.addedFileColumn.id;
			nextColumns = nextColumns.filter((column) => column.id !== id);
		}

		if (this.addedSourceColumn !== null) {
			nextColumns = nextColumns.filter(
				(column) => column.id !== this.addedSource.id
			);
		}

		const nextRows = rows.filter(
			(row) => row.sourceId === this.addedSource.id
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
		const nextSources = [...sources, this.addedSource];

		let nextRows = cloneDeep(rows);
		let nextColumns = cloneDeep(columns);
		if (this.addedFileColumn !== null) {
			nextColumns.unshift(this.addedFileColumn);

			nextRows = nextRows.map((row) => {
				const cell = this.addedFileCells.find(
					(cell) => cell.rowId === row.id
				);
				if (!cell) throw new CellNotFoundError({ rowId: row.id });
				row.cells.unshift(cell.cell);
				return row;
			});
		}
		if (this.addedSourceColumn !== null) {
			nextColumns.unshift(this.addedSourceColumn);

			nextRows = nextRows.map((row) => {
				const cell = this.addedSourceCells.find(
					(cell) => cell.rowId === row.id
				);
				if (!cell) throw new CellNotFoundError({ rowId: row.id });
				row.cells.unshift(cell.cell);
				return row;
			});
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
