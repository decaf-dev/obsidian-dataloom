import { SortDir } from "./types";
import { CellType } from "src/services/table/types";
import { Row, AppData } from "../table/types";

export const sortRows = (appData: AppData): Row[] => {
	const arr = [...appData.rows];
	const header = appData.headers.find(
		(header) => header.sortDir !== SortDir.NONE
	);
	if (!header) return arr;
	const { id, sortDir, type } = header;
	arr.sort((a, b) => {
		const cellA = appData.cells.find(
			(cell) => cell.headerId === id && cell.rowId === a.id
		);
		const cellB = appData.cells.find(
			(cell) => cell.headerId === id && cell.rowId === b.id
		);
		const contentA = cellA.content;
		const contentB = cellB.content;

		if (sortDir !== SortDir.NONE) {
			//Force empty cells to the bottom
			if (contentA === "" && contentB !== "") return 1;
			if (contentA !== "" && contentB === "") return -1;
			if (contentA === "" && contentB === "") return 0;
		}

		if (sortDir === SortDir.ASC) {
			if (type === CellType.TAG) {
				const tagA = appData.tags.find((tag) =>
					tag.selected.includes(cellA.id)
				);
				const tagB = appData.tags.find((tag) =>
					tag.selected.includes(cellB.id)
				);
				return tagA.content.localeCompare(tagB.content);
			} else {
				return contentA.localeCompare(contentB);
			}
		} else if (sortDir === SortDir.DESC) {
			if (type === CellType.TAG) {
				const tagA = appData.tags.find((tag) =>
					tag.selected.includes(cellA.id)
				);
				const tagB = appData.tags.find((tag) =>
					tag.selected.includes(cellB.id)
				);
				return tagB.content.localeCompare(tagA.content);
			} else {
				return contentB.localeCompare(contentA);
			}
		} else {
			//Sort by the default order in which the row was created
			const creationA = a.creationTime;
			const creationB = b.creationTime;
			if (creationA > creationB) return 1;
			if (creationA < creationB) return -1;
			return 0;
		}
	});
	return arr;
};
