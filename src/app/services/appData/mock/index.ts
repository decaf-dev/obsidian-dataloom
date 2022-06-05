export const mockTable = (headers: string[] = [], rows: string[][] = []) => {
	const table = document.createElement("table");
	const thead = document.createElement("thead");
	const tbody = document.createElement("tbody");

	const row = document.createElement("tr");
	for (let i = 0; i < headers.length; i++) {
		const td = document.createElement("th");
		const text = document.createTextNode(headers[i]);
		td.appendChild(text);
		row.appendChild(td);
	}
	thead.appendChild(row);

	for (let i = 0; i < rows.length; i++) {
		const row = document.createElement("tr");
		for (let j = 0; j < rows[i].length; j++) {
			const td = document.createElement("td");
			const text = document.createTextNode(rows[i][j]);
			td.appendChild(text);
			row.appendChild(td);
		}
		tbody.appendChild(row);
	}

	table.appendChild(thead);
	table.appendChild(tbody);
	return table;
};

interface parsedTable {
	numColumns?: number;
	numRows?: number;
	headers?: string[];
	cells?: string[];
}
export const mockParsedTable = (obj: parsedTable) => {
	const initialValue: parsedTable = {
		numColumns: 2,
		numRows: 2,
		headers: [],
		cells: [],
	};
	const { numColumns, numRows, headers, cells } = { ...initialValue, ...obj };
	const table = [];
	for (let i = 0; i < numColumns; i++) {
		headers.push(`Column ${i + 1}`);
	}
	table.push(headers);

	let cellCount = 0;
	for (let i = 0; i < numRows; i++) {
		const row = [];
		for (let j = 0; j < numColumns; j++) {
			cellCount = cellCount + 1;
			if (cells.length !== 0) {
				row.push(cells[i + j]);
			} else {
				row.push(`Cell ${cellCount}`);
			}
		}
		table.push(row);
	}
	return table;
};

/**
 * Creates a 1 column NLT markdown table
 * @returns An NLT markdown table
 */
export const createEmptyMarkdownTable = (): string => {
	const rows = [];
	rows[0] = "| New Column |";
	rows[1] = "| ---------- |";
	return rows.join("\n");
};
