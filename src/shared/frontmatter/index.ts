import { App } from "obsidian";
import { createCell, createTag } from "../loom-state/loom-state-factory";
import { Cell, CellType, Column, Tag } from "../loom-state/types/loom-state";

export const deserializeFrontmatterForCell = (
	app: App,
	column: Column,
	path: string
): {
	includeTime?: boolean;
	nextTags?: Tag[];
	newCell: Cell;
} | null => {
	const { frontmatterKey } = column;
	if (!frontmatterKey) return null;

	const fileMetadata = app.metadataCache.getCache(path);
	if (!fileMetadata) return null;

	const frontmatter = fileMetadata.frontmatter;
	if (!frontmatter) return null;

	const frontmatterValue: string | string[] | null =
		frontmatter[frontmatterKey.value];
	if (!frontmatterValue) return null;

	const { id, tags, type } = column;

	switch (type) {
		case CellType.TEXT:
		case CellType.EMBED:
		case CellType.FILE:
		case CellType.NUMBER:
		case CellType.CHECKBOX: {
			const newCell = createCell(id, {
				type: type,
				content: frontmatterValue as string,
			});
			return {
				newCell,
			};
		}
		case CellType.DATE: {
			//The formatterValue will return either YYYY-MM-DD or YYYY-MM-DDTHH:MM
			//the date object will take this in as local time as output an ISO string
			const dateString = frontmatterValue as string;
			const newCell = createCell(id, {
				type: type,
				dateTime: new Date(dateString).toISOString(),
			});
			return {
				newCell,
				includeTime: dateString.includes("T"),
			};
		}
		case CellType.TAG: {
			const newTags: Tag[] = [];
			const cellTagIds: string[] = [];
			if (frontmatterValue !== "") {
				const existingTag = tags.find(
					(tag) => tag.content === frontmatterValue
				);
				if (existingTag) {
					cellTagIds.push(existingTag.id);
				} else {
					const newTag = createTag(frontmatterValue as string);
					cellTagIds.push(newTag.id);
					newTags.push(newTag);
				}
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
		case CellType.MULTI_TAG: {
			const newTags: Tag[] = [];
			const cellTagIds: string[] = [];

			(frontmatterValue as string[]).forEach((tagContent) => {
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
