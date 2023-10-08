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
			const { name } = source as ObsidianFolderSource;
			return name;
		}
		default:
			throw new Error("Source type not supported");
	}
};
