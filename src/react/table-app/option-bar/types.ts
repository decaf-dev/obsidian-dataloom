import { Column } from "src/shared/types/types";

export interface ColumnWithMarkdown extends Column {
	markdown: string;
}
