import { App } from "obsidian";
import {
	createCheckboxCell,
	createDateCell,
	createEmbedCell,
	createFileCell,
	createMultiTagCell,
	createNumberCell,
	createTag,
	createTagCell,
	createTextCell,
} from "../loom-state/loom-state-factory";
import { Cell, CellType, Column, Tag } from "../loom-state/types/loom-state";
import { getAssignedPropertyType } from "./obsidian-utils";
import { ObsidianPropertyType } from "./types";
import { extractObsidianLinkComponents } from "../link/obsidian-link";
import { isExternalLink, isUrlLink } from "../link/check-link";

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

	const frontmatterValue: string | number | boolean | string[] | undefined =
		frontmatter[frontmatterKey];
	if (!frontmatterValue) return null;

	const assignedType =
		getAssignedPropertyType(app, frontmatterKey) ??
		ObsidianPropertyType.TEXT;

	const { id, tags, type } = column;

	switch (type) {
		case CellType.TEXT: {
			const newCell = createTextCell(id, {
				content: frontmatterValue as string,
			});
			return {
				newCell,
			};
		}
		case CellType.EMBED: {
			const isExternal = isExternalLink(frontmatterValue as string);
			let pathOrUrl: string = "";
			let pathAlias: string | null = null;

			if (isUrlLink(frontmatterValue as string)) {
				pathOrUrl = frontmatterValue as string;
			} else {
				const { path, alias } = extractObsidianLinkComponents(
					frontmatterValue as string
				);
				if (path !== null) {
					pathOrUrl = path;
					pathAlias = alias;
				}
			}
			const newCell = createEmbedCell(id, {
				isExternal,
				pathOrUrl,
				alias: pathAlias,
			});
			return {
				newCell,
			};
		}
		case CellType.FILE: {
			const { path, alias } = extractObsidianLinkComponents(
				frontmatterValue as string
			);
			const newCell = createFileCell(id, {
				path: path ?? "",
				alias: alias ?? "",
			});
			return {
				newCell,
			};
		}
		case CellType.NUMBER: {
			const newCell = createNumberCell(id, {
				value: Number(frontmatterValue), //Convert to Number for redundancy
			});
			return {
				newCell,
			};
		}
		case CellType.CHECKBOX: {
			const newCell = createCheckboxCell(id, {
				value: Boolean(frontmatterValue), //Convert to Boolean for redundancy
			});
			return {
				newCell,
			};
		}
		case CellType.DATE: {
			//The formatterValue will return either YYYY-MM-DD or YYYY-MM-DDTHH:MM
			//the date object will take this in as local time as output an ISO string
			const dateString = frontmatterValue as string;
			const newCell = createDateCell(id, {
				dateTime: new Date(dateString).toISOString(),
			});
			const includeTime = assignedType === ObsidianPropertyType.DATETIME;

			return {
				newCell,
				includeTime,
			};
		}
		case CellType.TAG: {
			let newTag: Tag | null = null;
			let cellTagId: string | null = null;
			if (frontmatterValue !== "") {
				const existingTag = tags.find(
					(tag) => tag.content === frontmatterValue
				);
				if (existingTag) {
					cellTagId = existingTag.id;
				} else {
					const tag = createTag(frontmatterValue as string);
					cellTagId = tag.id;
					newTag = tag;
				}
			}
			const newCell = createTagCell(id, {
				tagId: cellTagId,
			});
			const nextTags = [...column.tags, ...(newTag ? [newTag] : [])];
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

			const newCell = createMultiTagCell(id, {
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
