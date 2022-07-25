import { useEffect, useState } from "react";

import { AppData } from "../appData/state/appData";
import { SortDir } from "./types";
import { CONTENT_TYPE } from "src/app/constants";
import { Row } from "../appData/state/row";

interface UseSortedRows {
	sortedRows: Row[];
	sortDir: SortDir;
	resortRows: () => void;
}

export const useSortedRows = (appData: AppData): UseSortedRows => {
	const [sortTime, setSortTime] = useState(0);
	const [sorted, setSorted] = useState<SortedRows>({
		rows: [],
		sortDir: SortDir.DEFAULT,
	});

	function resortRows() {
		setSortTime(Date.now());
	}

	useEffect(() => {
		setSorted(sortRows(appData));
	}, [sortTime]);

	return { sortedRows: sorted.rows, sortDir: sorted.sortDir, resortRows };
};

interface SortedRows {
	sortDir: SortDir;
	rows: Row[];
}

export const sortRows = (appData: AppData): SortedRows => {
	const header = appData.headers.find(
		(header) => header.sortDir !== SortDir.DEFAULT
	);
	if (header) {
		const arr = [...appData.rows];
		const { id, sortDir, type } = header;
		arr.sort((a, b) => {
			const cellA = appData.cells.find(
				(cell) => cell.headerId === id && cell.rowId === a.id
			);
			const cellB = appData.cells.find(
				(cell) => cell.headerId === id && cell.rowId === b.id
			);
			const contentA = cellA.toString();
			const contentB = cellB.toString();

			if (sortDir !== SortDir.DEFAULT) {
				//Force empty cells to the bottom
				if (contentA === "" && contentB !== "") return 1;
				if (contentA !== "" && contentB === "") return -1;
				if (contentA === "" && contentB === "") return 0;
			}

			if (sortDir === SortDir.ASC) {
				if (type === CONTENT_TYPE.TAG) {
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
				if (type === CONTENT_TYPE.TAG) {
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
		return { rows: arr, sortDir };
	}
	return { rows: appData.rows, sortDir: SortDir.DEFAULT };
};
