import { Column } from "src/shared/loom-state/types/loom-state";

export interface ColumnWithMarkdown extends Column {
	markdown: string;
}
