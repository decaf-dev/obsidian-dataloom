import { createCell, createTag } from "./loom-state-factory";
import { Cell, CellType, Column, Tag } from "./types/loom-state";

export const parseContentFromFrontMatter = (
	column: Column,
	type: CellType,
	frontmatter: unknown
): {
	nextTags: Tag[];
	newCell: Cell;
} | null => {
	const { id, tags } = column;
	if (
		type === CellType.TEXT ||
		type === CellType.FILE ||
		type === CellType.NUMBER ||
		type === CellType.EMBED ||
		type === CellType.CHECKBOX
	) {
		if (!Array.isArray(frontmatter)) {
			const newCell = createCell(id, {
				type: type,
				content: frontmatter as string,
			});
			return {
				nextTags: tags,
				newCell,
			};
		}
	} else if (type === CellType.DATE) {
		if (typeof frontmatter === "number") {
			const newCell = createCell(id, {
				type: type,
				dateTime: frontmatter,
			});
			return {
				newCell,
				nextTags: tags,
			};
		}
	} else if (type === CellType.TAG || type === CellType.MULTI_TAG) {
		if (Array.isArray(frontmatter)) {
			//Iterate over the frontmatter and create any new tags
			//If tags already exist, I don't want to create the tag
			//But either way I want to get the ID of the tag

			const newTags: Tag[] = [];
			let cellTagIds: string[] = [];
			frontmatter.forEach((tagContent) => {
				const existingTag = tags.find(
					(tag) => tag.content === tagContent
				);
				if (existingTag) {
					cellTagIds.push(existingTag.id);
				} else {
					const newTag = createTag(tagContent);
					cellTagIds.push(newTag.id);
					newTags.push(newTag);
				}
			});

			if (type === CellType.TAG) {
				cellTagIds = cellTagIds.slice(0, 1);
			}
			const newCell = createCell(id, {
				type,
				tagIds: cellTagIds,
			});
			const nextTags = [...column.tags, ...newTags];
			return {
				newCell,
				nextTags,
			};
		}
	}

	//Invalid frontmatter for the cell type.
	return null;
};
