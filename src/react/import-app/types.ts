import { CellType } from "src/shared/loom-state/types/loom-state";

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
	//The index of the column in the imported data
	importColumnIndex: number;
	//The column id of the matching column in the existing state
	//A null value means that the column is new
	columnId: string;
}

export type ImportData = string[][];
