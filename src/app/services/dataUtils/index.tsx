import {
	Header,
	Tag,
	Row,
	Cell,
	initialHeader,
	initialCell,
	initialRow,
	initialTag,
	randomColor,
} from "../../services/utils";

import { CELL_TYPE } from "../../constants";
import { v4 as uuidv4 } from "uuid";
export interface AppData {
	headers: Header[];
	rows: Row[];
	cells: Cell[];
	tags: Tag[];
}

export const loadData = (el: HTMLElement): AppData => {
	const headers: Header[] = [];
	const rows: Row[] = [];
	const cells: Cell[] = [];
	const tags: Tag[] = [];

	const th = el.querySelectorAll("th");
	th.forEach((header, i) => {
		headers.push(initialHeader(header.innerHTML, i));
	});

	const tr = el.querySelectorAll("tr");
	tr.forEach((tr, i) => {
		//The thead will contain a row, so we want to ignore that
		if (i === 0) return;

		const rowId = uuidv4();
		rows.push(initialRow(rowId));

		const td = tr.querySelectorAll("td");
		td.forEach((td, i) => {
			const isTag = td.innerHTML.includes('<a href="#') ? true : false;
			const cellId = uuidv4();
			if (isTag) {
				headers[i].type = CELL_TYPE.TAG;
				cells.push(initialCell(cellId, rowId, i, CELL_TYPE.TAG, ""));
				tags.push(initialTag(td.innerHTML, cellId, randomColor()));
			} else {
				cells.push(
					initialCell(cellId, rowId, i, CELL_TYPE.TEXT, td.innerHTML)
				);
			}
		});
	});
	return {
		headers,
		rows,
		cells,
		tags,
	};
};
