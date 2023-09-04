import { CellType } from "src/shared/loom-state/types";

export enum StepType {
	DATA_TYPE,
	DATA_SOURCE,
	UPLOAD_DATA,
	MATCH_COLUMNS,
}

export enum DataType {
	UNSELECTED = "Select an option",
	CSV = "CSV",
	MARKDOWN = "Markdown",
}

export enum DataSource {
	UNSELECTED = "Select an option",
	FILE = "File",
	PASTE = "Paste from clipboard",
}

export interface ImportColumn {
	id: string;
	name: string;
	type: CellType;
}

export interface ColumnMatch {
	index: number;
	columnId: string;
}
