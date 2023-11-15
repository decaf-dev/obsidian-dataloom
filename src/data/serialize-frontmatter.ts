import { App, TFile } from "obsidian";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import { LoomState } from "src/shared/loom-state/types";
import { CellType } from "src/shared/loom-state/types/loom-state";
import { dateTimeToObsidianDateTime } from "./date-utils";
import { updateObsidianPropertyType } from "src/shared/frontmatter/obsidian-utils";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";

export const serializeFrontmatter = async (app: App, state: LoomState) => {
	//console.log("serializing frontmatter...");
	const { rows, columns, sources } = state.model;
	if (sources.length === 0) return;

	const sourceFileColumn = columns.find(
		(column) => column.type === CellType.SOURCE_FILE
	);
	if (!sourceFileColumn) throw new Error("Source file column not found");

	for (const row of rows) {
		const { sourceId, cells } = row;
		//Skip rows that don't have a source since these are stored in the loom file
		//and not in the frontmatter of individual files
		if (sourceId === null) continue;

		const sourceFileCell = cells.find(
			(cell) => cell.columnId === sourceFileColumn.id
		);
		if (!sourceFileCell) throw new Error("Source file cell not found");

		const file = app.vault.getAbstractFileByPath(sourceFileCell.content);
		if (!file) throw new Error("Source file not found");
		if (!(file instanceof TFile)) throw new Error("Expected TFile");

		for (const column of columns) {
			const { type, frontmatterKey, tags, includeTime } = column;
			//Skip source and source file columns because they don't have any content that is serialized
			if (type === CellType.SOURCE) continue;
			if (type === CellType.SOURCE_FILE) continue;
			if (!frontmatterKey) continue;

			const cell = cells.find((cell) => cell.columnId === column.id);
			if (!cell)
				throw new CellNotFoundError({
					columnId: column.id,
					rowId: row.id,
				});

			const { tagIds } = cell;

			let content: string | string[] | null = null;
			if (type === CellType.TAG || type === CellType.MULTI_TAG) {
				const cellTags = tags.filter((tag) => tagIds.includes(tag.id));
				const cellTagContent = cellTags.map((tag) => tag.content);

				if (type === CellType.MULTI_TAG) {
					content = cellTagContent;
				} else {
					content = cellTagContent[0];
				}
			} else if (type === CellType.DATE) {
				if (cell.dateTime) {
					content = dateTimeToObsidianDateTime(
						cell.dateTime,
						includeTime
					);
				}
			} else {
				content = cell.content;
			}

			await app.fileManager.processFrontMatter(file, (frontmatter) => {
				if (!frontmatter[frontmatterKey]) {
					//If the content is empty, skip
					//because we don't want to create an empty frontmatter key
					if (!content) return;
				}

				frontmatter[frontmatterKey] = content;
			});

			//Consider the situation where you have a date property and you have a date time column
			//If you save a datetime value, the date property will need to be converted to a date time value
			if (type === CellType.DATE) {
				await updateObsidianPropertyType(
					app,
					frontmatterKey,
					includeTime
						? ObsidianPropertyType.DATETIME
						: ObsidianPropertyType.DATE
				);
			}
		}
	}
};
