import { cloneDeep } from "lodash";
import { createCell, createColumn, createSource } from "../loom-state-factory";
import { LoomState } from "../types";
import {
	Cell,
	CellType,
	Column,
	Source,
	SourceType,
} from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";
import CellNotFoundError from "src/shared/error/cell-not-found-error";

export default class SourceAddCommand extends LoomStateCommand {
	private type: SourceType;
	private content: string;
	private fileColumnId: string | null;

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

	constructor(
		type: SourceType,
		content: string,
		fileColumnId: string | null
	) {
		super();
		this.type = type;
		this.content = content;
		this.fileColumnId = fileColumnId;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { sources, columns } = prevState.model;

		const newSource = createSource(this.type, this.content);
		this.addedSource = newSource;
		const nextSources = [...sources, newSource];

		const nextColumns = cloneDeep(columns);
		const sourceColumn = columns.find(
			(column) => column.type === CellType.SOURCE
		);

		let nextRows = cloneDeep(prevState.model.rows);
		if (this.fileColumnId === null) {
			const newColumn = createColumn({ cellType: CellType.FILE });
			this.addedFileColumn = newColumn;
			nextColumns.unshift(newColumn);

			nextRows = nextRows.map((row) => {
				const newCell = createCell(newColumn.id, {
					cellType: CellType.FILE,
				});
				this.addedFileCells.push({
					rowId: row.id,
					cell: newCell,
				});

				row.cells.unshift(newCell);
				return row;
			});
		}

		if (!sourceColumn) {
			const newColumn = createColumn({ cellType: CellType.SOURCE });
			this.addedSourceColumn = newColumn;
			nextColumns.unshift(newColumn);

			nextRows = nextRows.map((row) => {
				const newCell = createCell(newColumn.id, {
					cellType: CellType.SOURCE,
				});
				this.addedSourceCells.push({
					rowId: row.id,
					cell: newCell,
				});
				row.cells.unshift(newCell);
				return row;
			});
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

		const nextRows = rows.map((row) => {
			const nextCells = row.cells.filter(
				(cell) =>
					cell.columnId !== this.addedSource.id &&
					cell.columnId !== this.addedFileColumn?.id
			);
			return {
				...row,
				cells: nextCells,
			};
		});

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
