import { v4 as uuidv4 } from "uuid";

import {
	Header,
	Tag,
	Row,
	Cell,
	initialHeader,
	initialCell,
	initialRow,
	initialTag,
} from "../../services/state";
import { randomColor } from "../../services/utils";

import { CELL_TYPE } from "../../constants";
export interface AppData {
	headers: Header[];
	rows: Row[];
	cells: Cell[];
	tags: Tag[];
}

/**
 *
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
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
		td.forEach((td, j) => {
			const cellId = uuidv4();
			const cellType = getCellType(td.innerHTML);

			//Set header type based off of the first row's cell type
			if (i === 1) {
				headers[j].type = cellType;
			}

			//Check if doesn't match header
			if (cellType !== headers[j].type) {
				cells.push(
					initialCell(
						cellId,
						rowId,
						j,
						CELL_TYPE.ERROR,
						`Invalid data. Expected ${headers[j].type}`
					)
				);
				return;
			}

			if (cellType === CELL_TYPE.TAG) {
				headers[j].type = CELL_TYPE.TAG;
				cells.push(initialCell(cellId, rowId, j, CELL_TYPE.TAG, ""));

				//Check if tag already exists, otherwise create a new
				const tag = tags.find((tag) => tag.content === td.innerHTML);
				if (tag !== undefined) {
					const index = tags.indexOf(tag);
					tags[index].selected.push(cellId);
				} else {
					tags.push(initialTag(td.innerHTML, cellId, randomColor()));
				}
			} else {
				cells.push(
					initialCell(cellId, rowId, j, CELL_TYPE.TEXT, td.innerHTML)
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

export const getCellType = (innerHTML: string) => {
	if (innerHTML.match(/^\d+/)) {
		return CELL_TYPE.NUMBER;
	} else if (innerHTML.match(/(^<a href=\"#)(.+?)(<\/a>$)/)) {
		return CELL_TYPE.TAG;
	} else {
		return CELL_TYPE.TEXT;
	}
};

export const tagLinkForDisplay = (content: string) => {
	return content.replace(">#", ">");
};

export const stripLink = (content: string): string => {
	content = content.replace(/^<a.*?>/, "");
	content = content.replace(/<\/a>$/, "");
	return content;
};

export const stripFileLink = (content: string): string => {
	content = stripLink(content);
	return `[[${content}]]`;
};

export const hasLink = (content: string): boolean => {
	if (content.match(/^<a.*?>.*?<\/a>$/)) return true;
	return false;
};

export const hasSquareBrackets = (content: string): boolean => {
	if (content.match(/(^\[\[)(.*)(]]$)/)) return true;
	return false;
};

export const toFileLink = (content: string): string => {
	//Replace square brackets
	content = content.replace(/^\[\[/, "");
	content = content.replace(/]]$/, "");
	return `<a data-href="${content}" href="${content}" class="internal-link" target="_blank" rel="noopener">${content}</a>`;
};

export const toTagLink = (content: string): string => {
	return `<a href="#${content}" class="tag" target="_blank" rel="noopener">#${content}</a>`;
};
