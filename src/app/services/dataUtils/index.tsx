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
import { App, MarkdownView, Vault } from "obsidian";

export interface AppData {
	updateTime?: number;
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
			console.log(td.innerHTML);
			const cellId = uuidv4();
			let cellType = "";
			//Set header type based off of the first row's specified cell type
			if (i === 1) {
				cellType = getCellType(td.innerHTML, true);
				headers[j].type = cellType;
				return;
			} else {
				cellType = getCellType(td.innerHTML, false);
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
				cells.push(initialCell(cellId, rowId, j, CELL_TYPE.TAG, ""));

				let content = td.innerHTML;
				content = stripLink(content);
				content = stripPound(content);

				//Check if tag already exists, otherwise create a new
				const tag = tags.find((tag) => tag.content === content);
				if (tag !== undefined) {
					const index = tags.indexOf(tag);
					tags[index].selected.push(cellId);
				} else {
					tags.push(initialTag(content, cellId, randomColor()));
				}
				//TODO handle multi-tag
			} else if (cellType === CELL_TYPE.MULTI_TAG) {
				cells.push(initialCell(cellId, rowId, j, CELL_TYPE.TAG, ""));
			} else if (cellType === CELL_TYPE.NUMBER) {
				cells.push(
					initialCell(cellId, rowId, j, CELL_TYPE.TEXT, td.innerHTML)
				);
			} else if (cellType === CELL_TYPE.TEXT) {
				let content = td.innerHTML;
				if (hasLink(td.innerHTML)) {
					content = stripLink(content);
					content = addBrackets(content);
				}
				cells.push(
					initialCell(cellId, rowId, j, CELL_TYPE.TEXT, content)
				);
			}
		});
	});
	return {
		headers,
		rows,
		cells,
		tags,
		updateTime: 0,
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

export const saveData = async (app: App, data: AppData) => {
	const maxColumnCharLength: any = {};
	//Iterate over each header
	data.headers.forEach((header, i) => {
		maxColumnCharLength[i] = header.content.length;
	});

	//Iterate over each type
	Object.values(CELL_TYPE).forEach((type, i) => {
		if (maxColumnCharLength[i] < type.length) {
			maxColumnCharLength[i] = type.length;
		}
	});

	//Iterate over each cell
	data.cells.forEach((cell, i) => {
		if (cell.type === CELL_TYPE.TAG || cell.type === CELL_TYPE.MULTI_TAG) {
			const tags = data.tags.filter((tag) =>
				tag.selected.includes(cell.id)
			);

			let content = "";
			tags.forEach((tag, i) => {
				if (i === 0) content += addPound(tag.content);
				else content += " " + addPound(tag.content);
			});
			if (maxColumnCharLength[cell.position] < content.length)
				maxColumnCharLength[cell.position] = content.length;
		} else {
			if (maxColumnCharLength[cell.position] < cell.content.length)
				maxColumnCharLength[cell.position] = cell.content.length;
		}
	});

	//Now that we have the max character length, produce the document
	let fileData = "";
	fileData += "|";

	data.headers.forEach((header, i) => {
		fileData = writeContentToDataString(
			fileData,
			header.content,
			maxColumnCharLength[i]
		);
	});

	fileData += "\n|";
	data.headers.forEach((header, i) => {
		const content = Array(maxColumnCharLength[i] - 2)
			.fill("-")
			.join("");
		fileData = writeContentToDataString(
			fileData,
			content,
			maxColumnCharLength[i]
		);
	});

	fileData += "\n|";

	data.headers.forEach((header, i) => {
		fileData = writeContentToDataString(
			fileData,
			header.type,
			maxColumnCharLength[i]
		);
	});

	data.rows.forEach((row) => {
		fileData += "\n|";

		//TODO fix when I add the ability to drag columns
		//I will probably need to sort the cells
		const cells = data.cells.filter((cell) => cell.rowId === row.id);
		cells.forEach((cell, j) => {
			if (
				cell.type === CELL_TYPE.TAG ||
				cell.type === CELL_TYPE.MULTI_TAG
			) {
				const tags = data.tags.filter((tag) =>
					tag.selected.includes(cell.id)
				);

				let content = "";

				tags.forEach((tag, i) => {
					if (i === 0) content += addPound(tag.content);
					else content += " " + addPound(tag.content);
				});
				fileData = writeContentToDataString(
					fileData,
					content,
					maxColumnCharLength[j]
				);
			} else {
				fileData = writeContentToDataString(
					fileData,
					cell.content,
					maxColumnCharLength[j]
				);
			}
		});
	});

	const file = app.workspace.getActiveFile();
	console.log(fileData);
	try {
		const fileContent = await app.vault.adapter.read(file.name);
		//updateFile(app, file.name, fileData);
		app.vault.modify(file, fileData);
	} catch (err) {}
	// const view = app.workspace.getActiveViewOfType(MarkdownView);
	// if (view) {
	// 	console.log(fileData);
	// 	let data = view.getViewData();
	// 	//data += fileData;
	// 	//console.log(fileData);

	// 	const file = app.workspace.getActiveFile();
	// 	// app.vault.modify(file, fileData);
	// }
};

export const writeContentToDataString = (
	data: string,
	contentToWrite: string,
	columnCharacters: number
) => {
	data += "";
	data += contentToWrite;

	const numWhiteSpace = columnCharacters - contentToWrite.length;
	for (let i = 0; i < numWhiteSpace; i++) data += " ";
	data += " ";
	data += "|";
	return data;
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
			if (numTags === 1) {
				return CELL_TYPE.TAG;
			} else if (numTags > 1) {
				return CELL_TYPE.MULTI_TAG;
			} else {
				return CELL_TYPE.TEXT;
			}
		}
	}
};

export const getFileContents = async (app: App, fileName: string) => {
	try {
		return await app.vault.adapter.read(fileName);
	} catch (err) {
		console.log(err);
	}
};

export const updateFile = async (
	app: App,
	fileName: string,
	fileContents: string
) => {
	try {
		return await app.vault.adapter.write(fileName, fileContents);
	} catch (err) {
		console.log(err);
	}
};

export const countNumTags = (innerHTML: string): number => {
	return (innerHTML.match(/href=\"#/g) || []).length;
};

export const hasLink = (content: string): boolean => {
	if (content.match(/^<a.*?>.*?<\/a>$/)) return true;
	return false;
};

export const hasSquareBrackets = (content: string): boolean => {
	if (content.match(/(^\[\[)(.*)(]]$)/)) return true;
	return false;
};

export const stripSquareBrackets = (content: string): string => {
	content = content.replace(/^\[\[/, "");
	content = content.replace(/]]$/, "");
	return content;
};

export const stripLink = (content: string): string => {
	content = content.replace(/^<a.*?>/, "");
	content = content.replace(/<\/a>$/, "");
	return content;
};

export const stripPound = (content: string) => {
	return content.replace("#", "");
};

export const addPound = (content: string) => {
	return `#${content}`;
};

export const addBrackets = (content: string): string => {
	return `[[${content}]]`;
};

export const toFileLink = (content: string): string => {
	return `<a data-href="${content}" href="${content}" class="internal-link" target="_blank" rel="noopener">${content}</a>`;
};

export const toTagLink = (content: string): string => {
	return `<a href="#${content}" class="tag" target="_blank" rel="noopener">${content}</a>`;
};
