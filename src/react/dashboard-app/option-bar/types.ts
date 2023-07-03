import { Column } from "src/shared/types";

export interface ColumnWithMarkdown extends Column {
	markdown: string;
}
