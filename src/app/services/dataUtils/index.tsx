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
export interface ErrorData {
	columnIds: number[];
}

export const instanceOfErrorData = (object: any): object is ErrorData => {
	return "columnIds" in object;
};

export const findErrorData = (el: HTMLElement): ErrorData | null => {
	const tr = el.querySelectorAll("tr");
	const typeRowEl = tr[1];
	const td = typeRowEl.querySelectorAll("td");

	const errors: number[] = [];

	td.forEach((td, i) => {
		let cellType = getCellType(td.innerHTML, true);
		if (cellType === CELL_TYPE.ERROR) {
			errors.push(i);
		}
	});

	if (errors.length === 0) {
		return null;
	} else {
		return { columnIds: errors };
	}
};

export const findAppData = (el: HTMLElement): AppData => {
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

		//Only parse from below the type row
		if (i !== 1) {
			rows.push(initialRow(rowId));
		}

		const td = tr.querySelectorAll("td");
		td.forEach((td, j) => {
			const cellId = uuidv4();
			let cellType = "";
			//Set header type based off of the first row's specified cell type
			if (i === 1) {
				cellType = getCellType(td.innerHTML, true);
				headers[j].type = cellType;
				console.log(cellType, j);
				return;
			} else {
				cellType = getCellType(td.innerHTML, false);
				//A single tag will be read in as CELL_TYPE.TAG, so if we have
				//a header type of multi-tag selected, we will need to change it to MULTI_TAG
				if (headers[j].type === CELL_TYPE.MULTI_TAG) {
					if (cellType === CELL_TYPE.TAG) {
						cellType = CELL_TYPE.MULTI_TAG;
					}
				}
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

/**
 *
 * @param el The root table element
 * @returns AppData - The loaded data which the app will use to initialize its state
 */
export const loadData = (el: HTMLElement): AppData | ErrorData => {
	let data = findErrorData(el);
	if (data !== null) {
		return data;
	} else {
		return findAppData(el);
	}
};

export const getCellType = (innerHTML: string, firstRow: boolean) => {
	if (firstRow) {
		switch (innerHTML) {
			case CELL_TYPE.TEXT:
				return CELL_TYPE.TEXT;
			case CELL_TYPE.NUMBER:
				return CELL_TYPE.NUMBER;
			case CELL_TYPE.TAG:
				return CELL_TYPE.TAG;
			case CELL_TYPE.MULTI_TAG:
				return CELL_TYPE.MULTI_TAG;
			default:
				return CELL_TYPE.ERROR;
		}
	} else {
		if (innerHTML.match(/^\d+$/)) {
			return CELL_TYPE.NUMBER;
		} else {
			const numTags = countNumTags(innerHTML);
			if (numTags === 0) {
				return CELL_TYPE.TEXT;
			} else if (numTags === 1) {
				return CELL_TYPE.TAG;
			} else {
				return CELL_TYPE.MULTI_TAG;
			}
		}
	}
};

export const countNumTags = (innerHTML: string): number => {
	return (innerHTML.match(/href=\"#/g) || []).length;
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
