import { CellType, Column } from "src/shared/loom-state/types/loom-state";

export type ColumnChangeHandler = (
	columnId: string,
	data: Partial<Column>,
	options?: { shouldSortRows: boolean }
) => void;

export type ColumnTypeClickHandler = (columnId: string, type: CellType) => void;

export type ColumnDeleteClickHandler = (columnId: string) => void;

export type ColumnAddClickHandler = () => void;
