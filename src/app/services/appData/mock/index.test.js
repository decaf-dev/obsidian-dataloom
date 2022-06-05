import { mockTable, createEmptyMarkdownTable, mockParsedTable } from "./index";

describe("mockTable", () => {
	it("creates a mock table", () => {
		const parsedTable = mockParsedTable();
		const table = mockTable(parsedTable);
		const tr = table.querySelectorAll("tr");
		expect(tr.length).toBe(3);

		const th = tr[0].querySelectorAll("th");
		expect(th.length).toEqual(2);

		let td = tr[1].querySelectorAll("td");
		expect(td.length).toEqual(2);

		td = tr[2].querySelectorAll("td");
		expect(td.length).toEqual(2);
	});
});

describe("mockParsedTable", () => {
	it("creates a valid table", () => {
		const table = mockParsedTable();
		expect(table).toEqual([
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
			["Cell 3", "Cell 4"],
		]);
	});

	it("creates a table with 4 columns and 4 rows", () => {
		const table = mockParsedTable({ numColumns: 4, numRows: 4 });
		expect(table).toEqual([
			["Column 1", "Column 2", "Column 3", "Column 4"],
			["Cell 1", "Cell 2", "Cell 3", "Cell 4"],
			["Cell 5", "Cell 6", "Cell 7", "Cell 8"],
			["Cell 9", "Cell 10", "Cell 11", "Cell 12"],
			["Cell 13", "Cell 14", "Cell 15", "Cell 16"],
		]);
	});
});

describe("createEmptyMarkdownTable", () => {
	it("creates an empty 1 column table", () => {
		const table = createEmptyMarkdownTable();
		expect(table).toMatch(`| New Column |\n| ---------- |`);
	});
});
