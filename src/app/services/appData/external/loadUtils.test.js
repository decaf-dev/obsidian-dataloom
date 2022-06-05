import { mockParsedTable, mockTable } from "../mock";
import { hashHeaders, parseTableFromEl } from "./loadUtils";

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

describe("parseTableFromEl", () => {
	it("parses table", () => {
		const parsedTable = mockParsedTable();
		const table = mockTable(parsedTable);
		const parsed = parseTableFromEl(table);
		expect(parsed).toEqual([
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
			["Cell 3", "Cell 4"],
		]);
	});
});

// describe("findMarkdownTablesFromFileData", () => {
// 	it("parses a valid single column table", () => {
// 		const parsedTable = parseTableFromMarkdown(
// 			"|test|\n|---|\n|text|\n|this is some text|"
// 		);
// 		expect(parsedTable).toEqual([
// 			["test"],
// 			["text"],
// 			["this is some text"],
// 		]);
// 	});

// 	it("parses a valid single column table and trims cell content", () => {
// 		const parsedTable = parseTableFromMarkdown(
// 			"| test 1 |\n| --- |\n| text |\n| this is some text |"
// 		);
// 		expect(parsedTable).toEqual([
// 			["test 1"],
// 			["text"],
// 			["this is some text"],
// 		]);
// 	});

// 	it("parses valid multi-column table", () => {
// 		const parsedTable = parseTableFromMarkdown(
// 			"| test 1 | test 2 |\n| ---- | ------ |\n| text   |  tag |\n| this is some text | yes |"
// 		);
// 		expect(parsedTable).toEqual([
// 			["test 1", "test 2"],
// 			["text", "tag"],
// 			["this is some text", "yes"],
// 		]);
// 	});
// });
