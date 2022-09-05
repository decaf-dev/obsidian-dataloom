export const mockTable = (parsedTable: [][]) => {
	const table = document.createElement("table");
	const thead = document.createElement("thead");
	const tbody = document.createElement("tbody");

	const row = document.createElement("tr");
	parsedTable[0].forEach((th) => {
		const td = document.createElement("th");
		const text = document.createTextNode(th);
		td.appendChild(text);
		row.appendChild(td);
	});
	thead.appendChild(row);

	parsedTable.forEach((tr, i) => {
		if (i === 0) return;
		const row = document.createElement("tr");
		for (let j = 0; j < tr.length; j++) {
			const td = document.createElement("td");
			const text = document.createTextNode(tr[j]);
			td.appendChild(text);
			row.appendChild(td);
		}
		tbody.appendChild(row);
	});

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
			if (cells.length >= i + j + 1) {
				row.push(cells[i + j]);
			} else {
				row.push(`Cell ${cellCount}`);
			}
		}
		table.push(row);
	}
	return table;
};
