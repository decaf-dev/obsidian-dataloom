import {
	ObsidianFolderSource,
	Source,
	SourceType,
} from "../loom-state/types/loom-state";

export const getSourceCellContent = (source: Source | null) => {
	if (source === null) return "Internal";

	const { type } = source;
	switch (type) {
		case SourceType.FOLDER: {
			const { path } = source as ObsidianFolderSource;
			return path;
		}
		default:
			throw new Error("Source type not supported");
	}
};
