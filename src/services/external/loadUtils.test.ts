import { hashHeaders, findAppData } from "./loadUtils";

describe("findAppData", () => {
	it("finds headers", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
			["Cell 3", "Cell 4"],
		];
		const data = findAppData(parsedTable, parsedTable);
		expect(data.headers.length).toEqual(2);
		expect(data.headers[0].content).toEqual("Column 1");
		expect(data.headers[1].content).toEqual("Column 2");
	});

	it("finds cells", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
			["Cell 3", "Cell 4"],
		];
		const data = findAppData(parsedTable, parsedTable);
		expect(data.cells.length).toEqual(4);
		expect(data.cells[0].content).toEqual("Cell 1");
		expect(data.cells[1].content).toEqual("Cell 2");
		expect(data.cells[2].content).toEqual("Cell 3");
		expect(data.cells[3].content).toEqual("Cell 4");
	});
});

describe("hashHeaders", () => {
	it("produces same hash given same headers", () => {
		const headers = ["test1", "test2"];
		const hash = hashHeaders(headers);
		const hash2 = hashHeaders(headers);
		expect(hash).toEqual(hash2);
	});

	it("produces different hash given different headers", () => {
		const headers1 = ["test1", "test2"];
		const hash = hashHeaders(headers1);

		const headers2 = ["test3", "test4"];
		const hash2 = hashHeaders(headers2);
		expect(hash).not.toEqual(hash2);
	});
});

// describe("parseTableFromEl", () => {
// 	it("parses table", () => {
// 		const parsedTable = mockParsedTable();
// 		const parsed = parseTableFromEl(table);
// 		expect(parsed).toEqual([
// 			["Column 1", "Column 2"],
// 			["Cell 1", "Cell 2"],
// 			["Cell 3", "Cell 4"],
// 		]);
// 	});
// });
