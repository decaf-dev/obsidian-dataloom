import { SortDir } from "../sort/types";

export type ViewType = "live-preview" | "reading";

export enum CellType {
	TEXT = "text",
	NUMBER = "number",
	TAG = "tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	MULTI_TAG = "multi-tag",
}

export interface TableState {
	tableSettings: TableSettings;
	tableModel: TableModel;
	viewType: ViewType;
	shouldUpdate: boolean;
	tableCacheVersion: number;
}

export interface TableModel {
	headers: Header[];
	rows: Row[];
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
	width: "100px",
	type: CellType.TEXT,
	useAutoWidth: false,
	shouldWrapOverflow: false,
	tagColors: {},
};

export interface TableSettings {
	columns: {
		[index: number]: ColumnSettings;
	};
}
export interface Header {
	id: string;
	content: string;
	textContent: string;
}

export interface Row {
	id: string;
}

export interface Cell {
	id: string;
	rowId: string;
	headerId: string;
	content: string;
	textContent: string;
}
export interface TableComponent {
	id: string;
	component: React.ReactNode;
}
