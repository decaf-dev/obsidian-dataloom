import { App } from "obsidian";
import { createCell, createTag } from "../loom-state/loom-state-factory";
import { Cell, CellType, Column, Tag } from "../loom-state/types/loom-state";

export const deserializeFrontmatterForCell = (
	app: App,
	column: Column,
	path: string
): {
	nextTags: Tag[];
	newCell: Cell;
} | null => {
	const { frontmatterKey } = column;
	if (!frontmatterKey) return null;

	const frontmatter: string | string[] | null =
		app.metadataCache.getCache(path)?.frontmatter?.[frontmatterKey.value];
	if (!frontmatter) return null;

	const { id, tags, type } = column;

	switch (type) {
		case CellType.TEXT:
		case CellType.EMBED:
		case CellType.FILE:
		case CellType.NUMBER:
		case CellType.CHECKBOX:
			const newCell = createCell(id, {
				type: type,
				content: frontmatter as string,
			});
			return {
				nextTags: tags,
				newCell,
			};
		case CellType.DATE: {
			const newCell = createCell(id, {
				type: type,
				dateTime: frontmatter as string,
			});
			return {
				newCell,
				nextTags: tags,
			};
		}
		case CellType.TAG:
		case CellType.MULTI_TAG: {
			let frontmatterContent: string[] = [];
			if (Array.isArray(frontmatter)) {
				frontmatterContent = frontmatter;
			} else {
				frontmatterContent = [frontmatter as string];
			}
			const newTags: Tag[] = [];
			const cellTagIds: string[] = [];

			frontmatterContent.forEach((tagContent) => {
				if (tagContent !== "") {
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
				}
			});

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
		default:
			return null;
	}
};
