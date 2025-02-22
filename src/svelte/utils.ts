export type ParsedTableData = {
	head: string[];
	body: string[][];
};

export function parseTableToObject(tableEl: HTMLTableElement): ParsedTableData {
	const headers: string[] = [];

	// Extract headers from <thead> only
	tableEl.querySelectorAll("thead th").forEach((th) => {
		headers.push(th.textContent?.trim() ?? "");
	});

	// Get all table rows from <tbody> only
	const rows: string[][] = [];

	tableEl.querySelectorAll("tbody tr").forEach((row) => {
		const rowData: string[] = [];
		row.querySelectorAll("td").forEach((cell) => {
			rowData.push(cell.textContent?.trim() ?? "");
		});
		rows.push(rowData);
	});

	return { head: headers, body: rows };
}
