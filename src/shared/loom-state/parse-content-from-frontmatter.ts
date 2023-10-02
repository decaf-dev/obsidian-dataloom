import { isNumber } from "lodash";
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
				cellType: type,
				content: frontmatter as string,
			});
			return {
				nextTags: tags,
				newCell,
			};
		}
	} else if (type === CellType.DATE) {
		if (isNumber(frontmatter)) {
			const newCell = createCell(id, {
				cellType: type,
				dateTime: frontmatter,
			});
			return {
				newCell,
				nextTags: tags,
			};
		}
	} else if (type === CellType.TAG) {
		if (Array.isArray(frontmatter)) {
			//Iterate over the frontmatter and create any new tags
			//If tags already exist, I don't want to create the tag
			//But either way I want to get the ID of the tag

			const newTags: Tag[] = [];
			const cellTagIds: string[] = [];
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
			const newCell = createCell(id, {
				cellType: type,
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
