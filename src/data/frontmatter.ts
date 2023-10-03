import { App, TFile } from "obsidian";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import { LoomState } from "src/shared/loom-state/types";
import { CellType } from "src/shared/loom-state/types/loom-state";

export const saveFrontmatter = (app: App, state: LoomState) => {
	const { rows, columns, sources } = state.model;
	if (sources.length === 0) return;

	let sourceColumnId: string | null = null;
	let sourceFileColumnId: string | null = null;

	for (const column of columns) {
		const { id, type } = column;
		if (type === CellType.SOURCE_FILE) sourceFileColumnId = id;
		if (type === CellType.SOURCE) sourceColumnId = id;
	}

	for (const row of rows) {
		const { sourceId, cells } = row;
		if (sourceId === null) continue;

		const sourceFileCell = cells.find(
			(cell) => cell.columnId === sourceFileColumnId
		);
		if (!sourceFileCell) throw new Error("Source file cell not found");

		const file = app.vault.getAbstractFileByPath(sourceFileCell.content);
		if (!file) throw new Error("Source file not found");
		if (!(file instanceof TFile)) throw new Error("Excepected TFile");

		for (const column of columns) {
			const { type, frontmatterKey, tags } = column;
			if (type === CellType.SOURCE) continue;
			if (type === CellType.SOURCE_FILE) continue;
			if (frontmatterKey === null) continue;

			const cell = cells.find((cell) => cell.columnId === column.id);
			if (!cell)
				throw new CellNotFoundError({
					columnId: column.id,
					rowId: row.id,
				});
			const { tagIds } = cell;

			let content: unknown;
			if (type === CellType.TAG || type === CellType.MULTI_TAG) {
				const cellTags = tags.filter((tag) => tagIds.includes(tag.id));
				const cellTagContent = cellTags.map((tag) => tag.content);
				content = cellTagContent;
			} else if (type === CellType.DATE) {
				content = cell.dateTime;
			} else {
				content = cell.content;
			}

			app.fileManager.processFrontMatter(file, (frontmatter) => {
				frontmatter[frontmatterKey] = content;
			});
		}
	}
};
