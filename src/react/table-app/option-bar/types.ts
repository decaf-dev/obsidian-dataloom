import { CellType } from "src/data/types";

export type ColumnData = {
	id: string;
	name: string;
	cellType: CellType;
	isVisible: boolean;
};
