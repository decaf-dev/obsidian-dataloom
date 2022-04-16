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
