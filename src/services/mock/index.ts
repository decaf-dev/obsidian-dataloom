import { ColumnSettings, DEFAULT_COLUMN_SETTINGS } from "../table/types";

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

const tableRow = (numColumns: number) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		row += `cell-${i}`;
		row += " ";
		row += "|";
	}
	return row;
};

const tableIdRow = (numColumns: number, tableId: string) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		if (i === 0) row += tableId;
		row += " ";
		row += "|";
	}
	return row;
};

export const mockMarkdownTable = (
	numColumns: number,
	numDataRows: number,
	tableId: string
): string => {
	let table = "";
	table += tableHeaderRow(numColumns) + "\n";
	table += tableHyphenRow(numColumns);
	table += "\n";
	if (numDataRows !== 0) {
		for (let i = 0; i < numDataRows; i++) {
			table += tableRow(numColumns);
			table += "\n";
		}
	}
	table += tableIdRow(numColumns, tableId);
	return table;
};

export const mockSettings = (numColumns: number) => {
	const columns: { [x: string]: ColumnSettings } = {};
	for (let i = 0; i < numColumns; i++) {
		columns[i] = DEFAULT_COLUMN_SETTINGS;
	}
	return {
		columns,
	};
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
