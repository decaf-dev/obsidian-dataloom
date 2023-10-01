import { Source } from "../loom-state/types/loom-state";

export const getSourceCellContent = (source: Source | null) => {
	if (source === null) return "Internal";
	return source.content;
};
