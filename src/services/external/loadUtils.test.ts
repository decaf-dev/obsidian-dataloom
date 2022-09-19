import { mockMarkdownTable } from "../mock";
import {
	findMarkdownTablesFromFileData,
	parseCellsFromMarkdownTable,
	MARKDOWN_TABLE_HYPHEN_ROW_REGEX,
	MARKDOWN_TABLE_ROW_REGEX,
	TABLE_ID_REGEX,
} from "./loadUtils";
import { MarkdownTable } from "./types";

describe("TABLE_ID_REGEX", () => {
	it("matches a table id containing valid characters", () => {
		const id = "table-id-123ABCabc-";
		expect(!!id.match(TABLE_ID_REGEX)).toEqual(true);
	});

	it("matches a table id containing spaces before and after the id", () => {
		const id = "  table-id-123456  ";
		expect(!!id.match(TABLE_ID_REGEX)).toEqual(true);
	});

	it("matches a table id containing tabs before and after the id", () => {
		const id = "	table-id-123456	";
		expect(!!id.match(TABLE_ID_REGEX)).toEqual(true);
	});

	it("doesn't match a table id containing invalid characters", () => {
		const id = "table-id-$";
		expect(!!id.match(TABLE_ID_REGEX)).toEqual(false);
	});

	it("doesn't match a table id containing spaces as part of the id", () => {
		const id = "table-id-123 456";
		expect(!!id.match(TABLE_ID_REGEX)).toEqual(false);
	});

	it("doesn't match a table id containing text before the id", () => {
		const id = "text table-id-123456";
		expect(!!id.match(TABLE_ID_REGEX)).toEqual(false);
	});

	it("doesn't match a table id containing text after the id", () => {
		const id = "table-id-123456 text";
		expect(!!id.match(TABLE_ID_REGEX)).toEqual(false);
	});
});

describe("MARKDOWN_TABLE_ROW_REGEX", () => {
	it("matches a row containing spaces between text and pipes", () => {
		const row = "| column-1 | column-2 |";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(true);
	});
	it("matches a row containing no spaces between text and pipes", () => {
		const row = "|column-1|column-2|";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(true);
	});
	it("matches a row containing spaces before and after the row", () => {
		const row = "  | column-1 | column-2 |  ";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(true);
	});
	it("matches a row containing tabs before and after the row", () => {
		const row = "	| column-1 | column-2 |	";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(true);
	});
	it("doesn't match a row that only has one column", () => {
		const row = "| column-1 |";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row containing a missing end pipe", () => {
		const row = "| column-1 | column-2";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row containing a missing start pipe", () => {
		const row = "column-1 | column-2 |";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row containing text before the row", () => {
		const row = "test | column-1 | column-2 |";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row containing text after the row", () => {
		const row = "| column-1 | column-2 | test";
		expect(!!row.match(MARKDOWN_TABLE_ROW_REGEX)).toEqual(false);
	});
});

describe("MARKDOWN_HYPHEN_ROW_REGEX", () => {
	it("matches a row with spaces between text and pipes", () => {
		const row = "| --- | --- |";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(true);
	});
	it("matches a row with no spaces between text and pipes", () => {
		const row = "|---|---|";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(true);
	});
	it("matches a row containing spaces before and after the row", () => {
		const row = "  | --- | --- |  ";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(true);
	});
	it("matches a row containing tabs before and after the row", () => {
		const row = "	| --- | --- |	";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(true);
	});
	it("doesn't match a row with only one column", () => {
		const row = "| --- |";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row with a missing end pipe", () => {
		const row = "| --- | ---";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row with a missing start pipe", () => {
		const row = "--- | --- |";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row with only 2 hyphens in one column", () => {
		const row = "| --- | -- |";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row containing text before the row", () => {
		const row = "test | --- | --- |";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(false);
	});
	it("doesn't match a row containing text after the row", () => {
		const row = "| --- | --- | test";
		expect(!!row.match(MARKDOWN_TABLE_HYPHEN_ROW_REGEX)).toEqual(false);
	});
});

describe("findMarkdownTablesFromFileData", () => {
	it("finds one 2x3 table", () => {
		const tableId = "table-id-1";
		const tableMarkdown = mockMarkdownTable(2, 0, tableId);
		const data = "Some text\n" + tableMarkdown + "\nSome more text";
		const tables = findMarkdownTablesFromFileData(data);

		expect(tables.size).toEqual(1);
		tables.forEach((value, key) => {
			expect(value).toEqual({
				lineStart: 1,
				lineEnd: 3,
				text: tableMarkdown,
			});
			expect(key).toEqual(tableId);
		});
	});

	it("finds two 2x3 tables", () => {
		const tableId1 = "table-id-1";
		const tableId2 = "table-id-2";
		const tableMarkdown1 = mockMarkdownTable(2, 3, tableId1);
		const tableMarkdown2 = mockMarkdownTable(2, 3, tableId2);
		const data =
			"Some text\n" +
			tableMarkdown1 +
			"\nSome more text\n" +
			tableMarkdown2;
		const tables = findMarkdownTablesFromFileData(data);
		expect(tables.size).toEqual(2);

		let index = 0;
		tables.forEach((value, key) => {
			if (index === 0) {
				expect(value).toEqual({
					lineStart: 1,
					lineEnd: 3,
					text: tableMarkdown1,
				});
				expect(key).toEqual(tableId1);
			} else if (index === 1) {
				expect(value).toEqual({
					lineStart: 5,
					lineEnd: 7,
					text: tableMarkdown2,
				});
				expect(key).toEqual(tableId2);
			}
			index++;
		});
	});

	it("ignores 1x3 table", () => {
		const tableId1 = "table-id-1";
		const tableId2 = "table-id-2";
		const tableMarkdown1 = mockMarkdownTable(1, 3, tableId1);
		const tableMarkdown2 = mockMarkdownTable(2, 3, tableId2);
		const data =
			"Some text\n" +
			tableMarkdown1 +
			"\nSome more text\n" +
			tableMarkdown2;
		const tables = findMarkdownTablesFromFileData(data);
		expect(tables.size).toEqual(1);
	});

	it("ignores tables with invalid table id", () => {
		const invalidTableId = "";
		const validTableId = "table-id-1";
		const invalidTableMarkdown = mockMarkdownTable(2, 3, invalidTableId);
		const validTableMarkdown = mockMarkdownTable(2, 3, validTableId);
		const data =
			"Some text\n" +
			invalidTableMarkdown +
			"\nSome more text\n" +
			validTableMarkdown;
		const tables = findMarkdownTablesFromFileData(data);
		expect(tables.size).toEqual(1);
		tables.forEach((value, key) => {
			expect(value).toEqual({
				text: validTableMarkdown,
				lineStart: 5,
				lineEnd: 7,
			});
			expect(key).toEqual(validTableId);
		});
	});
});

describe("parseTableFromMarkdownTable", () => {
	it("parses each cell", () => {
		const markdown = mockMarkdownTable(2, 4, "table-id-0");
		const table: MarkdownTable = {
			lineStart: 0,
			lineEnd: 3,
			text: markdown,
		};
		const cells = parseCellsFromMarkdownTable(table);
		expect(cells.length).toEqual(6);
		expect(cells).toEqual([
			"column-0",
			"column-1",
			"cell-0",
			"cell-1",
			"table-id-0",
			"cell-1",
		]);
	});
});

describe("parseCellsFromMarkdownTable", () => {
	it("parses a table", () => {
		const markdown = mockMarkdownTable(2, 1, "table-id-0");
		const table = {
			lineStart: 0,
			lineEnd: 3,
			text: markdown,
		};
		const cells = parseCellsFromMarkdownTable(table);
		expect(cells.length).toEqual(6);
		expect(cells).toEqual([
			"column-0",
			"column-1",
			"cell-0",
			"cell-1",
			"table-id-0",
			"",
		]);
	});
});
