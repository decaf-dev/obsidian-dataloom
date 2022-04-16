import { v4 as uuidv4 } from "uuid";
import { CELL_COLOR, CELL_TYPE } from "../../constants";
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
import { AppData } from "../../services/state";
import { NltSettings } from "../../services/state";
import crc32 from "crc-32";

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(CELL_COLOR).length);
	return Object.values(CELL_COLOR)[index];
};

export const pruneSettingsCache = (
	settings: NltSettings,
	sourcePath: string,
	fileData: string
): NltSettings => {
	const obj = { ...settings };
	if (obj.appData[sourcePath]) {
		const tableHashes = findMarkdownTablesFromFileData(fileData).map(
			(markdownTable) => hashMarkdownTable(markdownTable)
		);

		Object.keys(obj.appData[sourcePath]).forEach((key) => {
			const hash = parseInt(key);
			if (!tableHashes.includes(hash))
				delete obj.appData[sourcePath][hash];
		});
	}
	return obj;
};

export const hashMarkdownTable = (markdownTable: string): number => {
	const output = markdownTable
		.replace(/\s/g, "")
		.replace(/[---]+\|/g, "")
		.replace(/\|/g, "");
	return crc32.str(output);
};

export const hashParsedTable = (parsedTable: string[][]): number => {
	const output = parsedTable.join("").replace(/,/g, "").replace(/\s/g, "");
	return crc32.str(output);
};

/**
 * Finds a regex that will match a table based on header content, type definition row,
 * and number of cells
 * @param headers The headers
 * @param rows The rows
 * @returns A regex that matches this table
 */
export const findTableRegex = (headers: Header[], rows: Row[]): RegExp => {
	const regex: string[] = [];
	regex[0] = "\\|";
	regex[0] += headers.map((header) => `.*${header.content}.*\\|`).join("");

	//Hyphen row, type definition row, and then all other rows
	for (let i = 0; i < rows.length + 2; i++) regex[i + 1] = "\\|.*\\|";

	const expression = new RegExp(regex.join("\n"));
	return expression;
};

/**
 * Converts app data to a valid Obsidian markdown string
 * @param data The app data
 * @returns An Obsidian markdown string
 */
export const appDataToString = (data: AppData): string => {
	//TODO write tests
	const columnCharLengths = calcColumnCharLengths(
		data.headers,
		data.cells,
		data.tags
	);

	let fileData = "|";

	data.headers.forEach((header, i) => {
		fileData = writeMarkdownTableCell(
			fileData,
			header.content,
			columnCharLengths[i]
		);
	});

	fileData += "\n";

	for (let i = 0; i < data.headers.length; i++) {
		const content = Array(columnCharLengths[i]).fill("-").join("");
		fileData = writeMarkdownTableCell(
			fileData,
			content,
			columnCharLengths[i]
		);
	}

	fileData += "\n";

	data.headers.forEach((header, i) => {
		fileData = writeMarkdownTableCell(
			fileData,
			header.type,
			columnCharLengths[i]
		);
	});

	data.rows.forEach((row) => {
		fileData += "\n";

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
					if (tag.content === "") return;
					if (i === 0) content += addPound(tag.content);
					else content += " " + addPound(tag.content);
				});
				fileData = writeMarkdownTableCell(
					fileData,
					content,
					columnCharLengths[j]
				);
			} else {
				fileData = writeMarkdownTableCell(
					fileData,
					cell.content,
					columnCharLengths[j]
				);
			}
		});
	});
	return fileData;
};

export const writeMarkdownTableCell = (
	data: string,
	contentToWrite: string,
	columnCharacters: number
) => {
	//If we're starting a new row
	if (data[data.length - 1] === "\n") data += "|";

	data += " ";
	data += contentToWrite;

	const numWhiteSpace = columnCharacters - contentToWrite.length;

	//Pads the cell with white space
	for (let i = 0; i < numWhiteSpace; i++) data += " ";
	data += " ";
	data += "|";
	return data;
};

/**
 * Calculates the max char length for each column.
 * This is used to know how much padding to add to cell.
 * @param headers An array of headers
 * @param cells An array of cells
 * @param tags An array of tags
 * @returns An object containing the calculated lengths
 */
export const calcColumnCharLengths = (
	headers: Header[],
	cells: Cell[],
	tags: Tag[]
): { [columnPosition: number]: number } => {
	const columnCharLengths: { [columnPosition: number]: number } = [];

	//Check headers
	headers.forEach((header, i) => {
		columnCharLengths[i] = header.content.length;
	});

	//Check types
	Object.values(CELL_TYPE).forEach((type, i) => {
		if (columnCharLengths[i] < type.length)
			columnCharLengths[i] = type.length;
	});

	//Check cells
	cells.forEach((cell, i) => {
		if (cell.type === CELL_TYPE.TAG || cell.type === CELL_TYPE.MULTI_TAG) {
			const arr = tags.filter((tag) => tag.selected.includes(cell.id));

			//TODO edit for multi-tag
			//Do we want the tags on one line?
			let content = "";
			arr.forEach((tag, i) => {
				if (tag.content === "") return;
				if (i === 0) content += addPound(tag.content);
				else content += " " + addPound(tag.content);
			});
			if (columnCharLengths[cell.headerIndex] < content.length)
				columnCharLengths[cell.headerIndex] = content.length;
		} else {
			if (columnCharLengths[cell.headerIndex] < cell.content.length)
				columnCharLengths[cell.headerIndex] = cell.content.length;
		}
	});
	return columnCharLengths;
};

export const mergeAppData = (
	oldAppData: AppData,
	newAppData: AppData
): AppData => {
	//Grab sort settings
	const merged = { ...newAppData };
	oldAppData.headers.forEach((headers, i) => {
		merged.headers[i].sortName = headers.sortName;
	});

	//Grab tag settings
	oldAppData.tags.forEach((tag, i) => {
		const found = merged.tags.find((t) => t.content === tag.content);
		if (found) {
			const index = merged.tags.indexOf(found);
			merged.tags[index].color = tag.color;
		}
	});
	return merged;
};

export const findAppData = (parsedTable: string[][]): AppData => {
	const headers: Header[] = [];
	const rows: Row[] = [];
	const cells: Cell[] = [];
	const tags: Tag[] = [];

	parsedTable.forEach((row, i) => {
		if (i === 0) {
			row.forEach((th, j) => {
				headers.push(initialHeader(th, j));
			});
		} else {
			const rowId = uuidv4();

			//Only parse from below the type row
			if (i !== 1) {
				//Since these operations are preformed very quickly, it's possible
				//for our to get the same time
				//Add a timeoffset to make sure the time is different
				const time = Date.now() + i;
				rows.push(initialRow(rowId, time));
			}

			row.forEach((td, j) => {
				const cellId = uuidv4();
				let cellType = "";
				//Set header type based off of the first row's specified cell type
				if (i === 1) {
					cellType = td;
					headers[j].type = cellType;
					return;
				} else {
					cellType = findCellType(td, headers[j].type);
				}

				//Check if doesn't match header
				if (cellType !== headers[j].type) {
					cells.push(
						initialCell(
							cellId,
							rowId,
							j,
							CELL_TYPE.ERROR,
							td,
							headers[j].type
						)
					);
					return;
				}

				if (cellType === CELL_TYPE.TAG) {
					cells.push(
						initialCell(cellId, rowId, j, CELL_TYPE.TAG, "")
					);

					let content = td;
					content = stripLink(content);
					content = stripPound(content);

					//Check if tag already exists, otherwise create a new
					const tag = tags.find((tag) => tag.content === content);
					if (tag !== undefined) {
						const index = tags.indexOf(tag);
						tags[index].selected.push(cellId);
					} else {
						tags.push(
							initialTag(
								headers[j].index,
								i - 2, //Subtract both the header row and type def row
								cellId,
								content,
								randomColor()
							)
						);
					}
				} else if (cellType === CELL_TYPE.NUMBER) {
					cells.push(
						initialCell(cellId, rowId, j, CELL_TYPE.TEXT, td)
					);
				} else if (cellType === CELL_TYPE.TEXT) {
					let content = td;
					if (hasLink(td)) {
						content = stripLink(content);
						content = addBrackets(content);
					}
					cells.push(
						initialCell(cellId, rowId, j, CELL_TYPE.TEXT, content)
					);
				}
			});
		}
	});

	return {
		headers,
		rows,
		cells,
		tags,
		updateTime: 0,
	};
};

export const validTypeDefinitionRow = (parsedTable: string[][]): boolean => {
	const typeDefRow = parsedTable[1];
	if (!typeDefRow) return false;

	let valid = true;

	for (let i = 0; i < typeDefRow.length; i++) {
		const cell = typeDefRow[i];
		const didntMatch = Object.values(CELL_TYPE).every(
			(type) => type !== cell
		);
		if (didntMatch) valid = false;
	}
	return valid;
};

export const findCellType = (textContent: string, expectedType: string) => {
	//If empty then just set it to the type it's supposed to be.
	//We do this to allow blank cells
	if (textContent === "") return expectedType;

	let cellType = CELL_TYPE.ERROR;

	const numTags = countNumTags(textContent);
	if (numTags === 1) {
		//Don't allow spaces in tags
		if (!textContent.match(/\s/)) cellType = CELL_TYPE.TAG;
	} else if (numTags > 1) {
		return CELL_TYPE.MULTI_TAG;
	} else if (textContent.match(/^\d+$/)) {
		if (expectedType === CELL_TYPE.TEXT) cellType = CELL_TYPE.TEXT;
		else cellType = CELL_TYPE.NUMBER;
	} else {
		cellType = CELL_TYPE.TEXT;
	}

	if (cellType !== expectedType) return CELL_TYPE.ERROR;
	return cellType;
};

export const findMarkdownTablesFromFileData = (data: string): string[] => {
	//We match groups of lines that follow the markdown table syntax
	// | line 1  |
	// | line 2  |
	const matches = data.match(/(\|.*\|(\r\n|\r|\n){0,1}){1,}/g) || [];
	//From there we check if this is actually a table
	//We will just look for the hyphen row with each cell having at least 3 hyphens
	return matches.filter((match) => isMarkdownTable(match));
};

export const isMarkdownTable = (data: string): boolean => {
	const rows = data.match(markdownRowsRegex);

	if (rows && rows.length >= 2) {
		const headerRow = rows[0];
		const headerCells = headerRow.match(markdownCellsRegex);
		const hyphenRow = rows[1];
		const hyphenCells = hyphenRow.match(markdownCellsRegex);

		if (hyphenCells.length < headerCells.length) return false;

		for (let j = 0; j < hyphenCells.length; j++) {
			const cell = hyphenCells[j];
			if (!cell.match(markdownHyphenCellRegex)) return false;
		}
		return true;
	}
	return false;
};

/**
 * Parses data for an individual table.
 * This is not used for all file data. It is intended to be used
 * on one table returned from findMarkdownTablesFromFileData
 *
 * We assume that this is a valid markdown table
 * @param data The data for one table. No more, no less.
 * @returns A parsed table representation
 */
export const parseTableFromMarkdown = (data: string): string[][] => {
	//Start by breaking up everything into rows based off of a row syntax | ---- |
	const rows = data.match(markdownRowsRegex);

	const table = [];
	//For each row, parse each cell
	for (let i = 0; i < rows.length; i++) {
		let cells = rows[i].match(markdownCellsRegex);
		cells = cells.map((cell) => cell.replace(/\|/g, "").trim());
		cells = cells.filter(
			(cell) => (cell.match("-{3,}") || []).length === 0
		);

		if (cells.length !== 0) table.push(cells);
	}
	return table;
};

export const parseTableFromEl = (el: HTMLElement) => {
	const table = [];
	const tr = el.getElementsByTagName("tr");
	const th = tr[0].getElementsByTagName("th");

	let row = [];
	for (let i = 0; i < th.length; i++) row.push(th[i].textContent);
	table.push(row);

	for (let i = 1; i < tr.length; i++) {
		const td = tr[i].getElementsByTagName("td");
		row = [];
		for (let j = 0; j < td.length; j++) row.push(td[j].textContent);
		table.push(row);
	}
	return table;
};

/**
 * Matches an individual markdown hyphen cell
 * e.g. "\t ---\t|"
 * Will match spaces, tabs, and ending pipe symbol
 * We don't match the first pipe symbol because not every cell in a row will
 * have 2 pipes
 */
export const markdownHyphenCellRegex = new RegExp(
	/[ \t]{0,}[-]{3,}[ \t]{0,}\|/
);

/**
 * Matches an individual markdown cell
 * e.g. "\t thisismycell\t|""
 * Will match spaces, tabs, and ending pipe symbol
 *
 * We don't match the first pipe symbol because not every cell in a row will
 * have 2 pipes
 * @returns An array of matches
 */
export const markdownCellsRegex = new RegExp(/[ \t]{0,}[^|\r\n]+[ \t]{0,}\|/g);

/**
 * Matches an individual markdown row
 * @returns An array of matches
 */
export const markdownRowsRegex = new RegExp(/(\|[ ]{0,}.*[ ]{0,}\|){1,}/g);

/**
 * Counts the number of tags in a string.
 * @param input The input string
 * @returns The number of tags in the input string
 */
export const countNumTags = (input: string): number => {
	return (input.match(/#[^ \t]+/g) || []).length;
};

/**
 * Checks to see if input string contains hyperlinks (<a>)
 * @param input The input string
 * @returns Has hyperlinks or not
 */
export const hasLink = (input: string): boolean => {
	if (input.match(/^<a.*?>.*?<\/a>$/)) return true;
	return false;
};

/**
 * Checks to see if input string starts and ends with double square brackets
 * @param input The input string
 * @returns Has square brackets or not
 */
export const hasSquareBrackets = (input: string): boolean => {
	if (input.match(/(^\[\[)(.*)(]]$)/)) return true;
	return false;
};

/**
 * Removes double square brackets from input string
 * @param input The input string
 * @returns A string without double square brackets ([[ ]])
 */
export const stripSquareBrackets = (input: string): string => {
	input = input.replace(/^\[\[/, "");
	input = input.replace(/]]$/, "");
	return input;
};

/**
 * Removes all hyperlinks from input string
 * @param input The input string
 * @returns A string with no hyperlinks (<a>)
 */
export const stripLink = (input: string): string => {
	input = input.replace(/^<a.*?>/, "");
	input = input.replace(/<\/a>$/, "");
	return input;
};

/**
 * Removes pound sign from input string
 * @param input The input string
 * @returns A string with no pound (#) symbol
 */
export const stripPound = (input: string) => {
	return input.replace("#", "");
};

/**
 * Add a pounds sign to input string
 * @param input The input string
 * @returns A string starting with a pound (#) symbol
 */
export const addPound = (input: string) => {
	return `#${input}`;
};

/**
 * Adds double square brackets to input string
 * @param input The input string
 * @returns A string surrounded by double square brackets ([[ ]])
 */
export const addBrackets = (input: string): string => {
	return `[[${input}]]`;
};

/**
 * Converts file name to an Obsidian file hyperlink
 * @param fileName The file name without double square brackets
 * @returns A hyperlink (<a>) link for an Obsidian file
 */
export const toFileLink = (fileName: string): string => {
	return `<a data-href="${fileName}" href="${fileName}" class="internal-link" target="_blank" rel="noopener">${fileName}</a>`;
};

/**
 * Converts tag name to an Obsidian tag hyperlink
 * @param tagName The tagName
 * @returns A hyperlink (<a>) for an Obsidian tag
 */
export const toTagLink = (tagName: string): string => {
	if (tagName.startsWith("#")) throw "tagName cannot start with pound symbol";
	return `<a href="#${tagName}" class="tag" target="_blank" rel="noopener">${tagName}</a>`;
};
