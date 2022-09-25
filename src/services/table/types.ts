import { SortDir } from "../sort/types";
import { MIN_COLUMN_WIDTH } from "./constants";

export enum CellType {
	TEXT = "text",
	NUMBER = "number",
	TAG = "tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	MULTI_TAG = "multi-tag",
}

export type ColumnId = string;
export type RowId = string;
export type CellId = string;

export interface TableComponent {
	id: string;
	component: React.ReactNode;
}

export interface Cell {
	id: CellId;
	columnId: ColumnId;
	rowId: RowId;
	markdown: string;
	html: string;
}

export interface TableModel {
	columns: ColumnId[];
	rows: RowId[];
	cells: Cell[];
}

export interface ColumnSettings {
	sortDir: SortDir;
	width: string;
	type: CellType;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
	tagColors: {
		[hash: string]: string;
	};
}

export const DEFAULT_COLUMN_SETTINGS: ColumnSettings = {
	sortDir: SortDir.NONE,
	width: `${MIN_COLUMN_WIDTH}px`,
	type: CellType.TEXT,
	useAutoWidth: false,
	shouldWrapOverflow: false,
	tagColors: {},
};

export interface TableSettings {
	columns: {
		[columnId: string]: ColumnSettings;
	};
}

export interface TableState {
	settings: TableSettings;
	model: TableModel;
	cacheVersion: number;
}
