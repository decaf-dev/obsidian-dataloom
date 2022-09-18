const tableHeaderRow = (numColumns: number) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		row += `column-${i}`;
		row += " ";
		row += "|";
	}
	return row;
};

const tableHyphenRow = (numColumns: number) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		row += "---";
		row += " ";
		row += "|";
	}
	return row;
};

const tableRow = (numColumns: number, tableId: string) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		if (i === 0) row += tableId;
		else row += `cell-${i}`;
		row += " ";
		row += "|";
	}
	return row;
};

export const mockMarkdownTable = (
	numColumns: number,
	numRows: number,
	tableId: string
): string => {
	let table = "";
	if (numRows >= 1) table += tableHeaderRow(numColumns) + "\n";
	if (numRows >= 2) table += tableHyphenRow(numColumns);
	if (numRows >= 3) {
		let numDataRows = numRows - 2;
		table += "\n";
		for (let i = 0; i < numDataRows; i++) {
			table += tableRow(
				numColumns,
				i == numDataRows - 1 ? tableId : `cell-0`
			);
			if (i < numDataRows - 1) table += "\n";
		}
	}
	return table;
};

// export const mockTable = (parsedTable: string[][]) => {
// 	const table = document.createElement("table");
// 	const thead = document.createElement("thead");
// 	const tbody = document.createElement("tbody");

// 	const row = document.createElement("tr");
// 	parsedTable[0].forEach((th) => {
// 		const td = document.createElement("th");
// 		const text = document.createTextNode(th);
// 		td.appendChild(text);
// 		row.appendChild(td);
// 	});
// 	thead.appendChild(row);

// 	parsedTable.forEach((tr, i) => {
// 		if (i === 0) return;
// 		const row = document.createElement("tr");
// 		for (let j = 0; j < tr.length; j++) {
// 			const td = document.createElement("td");
// 			const text = document.createTextNode(tr[j]);
// 			td.appendChild(text);
// 			row.appendChild(td);
// 		}
// 		tbody.appendChild(row);
// 	});

// 	table.appendChild(thead);
// 	table.appendChild(tbody);
// 	return table;
// };
