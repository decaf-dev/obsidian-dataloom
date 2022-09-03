import { useEffect, useState, useRef, useMemo } from "react";

import { TableModel } from "../appData/state/types";
import { SortDir } from "./types";
import { CONTENT_TYPE } from "src/constants";
import { Row } from "../appData/state/row";
import { Header } from "../appData/state/header";

interface SortedRows {
	sortDir: SortDir;
	sortedRows: Row[];
}

export const useSortedRows = (
	appData: TableModel,
	sortTime: number
): SortedRows => {
	//Sort on mount
	const lastTime = useRef(-1);
	const lastSort = useRef({
		sortDir: SortDir.DEFAULT,
		sortedRows: appData.rows,
	});

	//Sort when sort time has changed
	if (lastTime.current !== sortTime) {
		lastTime.current = sortTime;
		const header = appData.headers.find(
			(header) => header.sortDir !== SortDir.DEFAULT
		);
		let sorted = {
			sortedRows: appData.rows,
			sortDir: SortDir.DEFAULT,
		};
		if (header) {
			sorted = sortRows(appData, header);
			lastSort.current = sorted;
		}
		lastSort.current = sorted;
		return sorted;
	} else {
		return lastSort.current;
	}
};

export const sortRows = (
	appData: TableModel,
	sortedHeader: Header
): SortedRows => {
	const arr = [...appData.rows];
	const { id, sortDir, type } = sortedHeader;
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
	return { sortedRows: arr, sortDir };
};
