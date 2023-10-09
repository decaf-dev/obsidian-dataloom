import { CellType, Column } from "src/shared/loom-state/types/loom-state";

export type ColumnChangeHandler = (
	id: string,
	data: Partial<Column>,
	options?: { shouldSortRows: boolean }
) => void;

export type ColumnTypeClickHandler = (id: string, type: CellType) => void;

export type ColumnDeleteClickHandler = (id: string) => void;

export type ColumnAddClickHandler = () => void;
