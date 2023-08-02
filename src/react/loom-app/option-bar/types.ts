import { Column } from "src/shared/loom-state/types";

export interface ColumnWithMarkdown extends Column {
	markdown: string;
}
