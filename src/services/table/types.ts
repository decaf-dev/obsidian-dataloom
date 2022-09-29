import { SortDir } from "../sort/types";

export enum CellType {
	TEXT = "text",
	NUMBER = "number",
	TAG = "tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	MULTI_TAG = "multi-tag",
}

export interface TableComponent {
	id: string;
	component: React.ReactNode;
}

export interface Cell {
	id: string;
	columnId: string;
	rowId: string;
	markdown: string;
	html: string;
	isHeader: boolean;
}

export interface TableModel {
	columnIds: string[];
	rowIds: string[];
	cells: Cell[];
}

export interface TagCellReference {
	rowId: string;
	columnId: string;
}

export interface Tag {
	id: string;
	markdown: string;
	html: string;
	color: string;
	cells: TagCellReference[];
}
export interface ColumnSettings {
	sortDir: SortDir;
	width: string;
	type: CellType;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
	tags: Tag[];
}

export const DEFAULT_COLUMN_SETTINGS: ColumnSettings = {
	sortDir: SortDir.NONE,
	width: "120px",
	type: CellType.TEXT,
	useAutoWidth: false,
	shouldWrapOverflow: false,
	tags: [],
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
