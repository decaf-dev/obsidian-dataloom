import { mockTable } from "../mock";
import { parseTableFromEl, parseTableFromMarkdown } from "./loadUtils";

describe("parseTableFromEl", () => {
	it("parses table", () => {
		const table = mockTable(
			["test 1", "test 2"],
			[
				["cell 1", "cell 2"],
				["cell 3", "cell 4"],
			]
		);
		const parsedTable = parseTableFromEl(table);
		expect(parsedTable).toEqual([
			["test 1", "test 2"],
			["cell 1", "cell 2"],
			["cell 3", "cell 4"],
		]);
	});
});

describe("findMarkdownTablesFromFileData", () => {
	it("parses a valid single column table", () => {
		const parsedTable = parseTableFromMarkdown(
			"|test|\n|---|\n|text|\n|this is some text|"
		);
		expect(parsedTable).toEqual([
			["test"],
			["text"],
			["this is some text"],
		]);
	});

	it("parses a valid single column table and trims cell content", () => {
		const parsedTable = parseTableFromMarkdown(
			"| test 1 |\n| --- |\n| text |\n| this is some text |"
		);
		expect(parsedTable).toEqual([
			["test 1"],
			["text"],
			["this is some text"],
		]);
	});

	it("parses valid multi-column table", () => {
		const parsedTable = parseTableFromMarkdown(
			"| test 1 | test 2 |\n| ---- | ------ |\n| text   |  tag |\n| this is some text | yes |"
		);
		expect(parsedTable).toEqual([
			["test 1", "test 2"],
			["text", "tag"],
			["this is some text", "yes"],
		]);
	});
});
