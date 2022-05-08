import {
	findTableRegex,
	calcColumnCharLengths,
	appDataToMarkdown,
} from "./saveUtils";

describe("findAppData", () => {
	it("finds text data", () => {
		const table = [
			["Column 1", "Column 2"],
			["12345", ""],
			["text", "text"],
			["some text", "some more text"],
		];
		const data = findAppData(table);
		expect(data.headers.length).toEqual(2);
		expect(data.rows.length).toEqual(1);
		expect(data.cells.length).toEqual(2);
		expect(data.tags.length).toEqual(0);
	});

	it("finds tag data", () => {
		const table = [
			["Column 1", "Column 2"],
			["12345", ""],
			["tag", "tag"],
			["#tag1", "#tag2"],
		];
		const data = findAppData(table);
		expect(data.headers.length).toEqual(2);
		expect(data.rows.length).toEqual(1);
		expect(data.cells.length).toEqual(2);
		expect(data.tags.length).toEqual(2);
	});

	it("finds tag data", () => {
		const table = [
			["Column 1", "Column 2"],
			["12345", ""],
			["tag", "tag"],
			["#tag1", "#tag2"],
		];
		const data = findAppData(table);
		expect(data.headers.length).toEqual(2);
		expect(data.rows.length).toEqual(1);
		expect(data.cells.length).toEqual(2);
		expect(data.tags.length).toEqual(2);
	});
});

describe("validTypeDefinitionRow", () => {
	it("returns true if row exists", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["12345", ""],
			["text", "text"],
		];
		const hasTDR = validTypeDefinitionRow(parsedTable);
		expect(hasTDR).toBe(true);
	});

	it("returns false if no row exists", () => {
		const parsedTable = [["Column 1", "Column 2"]];
		const hasTDR = validTypeDefinitionRow(parsedTable);
		expect(hasTDR).toBe(false);
	});

	it("returns false if invalid types", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["12345", ""],
			["text", "invalid"],
		];
		const hasTDR = validTypeDefinitionRow(parsedTable);
		expect(hasTDR).toBe(false);
	});
});

describe("appDataToMarkdown", () => {
	it("converts appData to valid markdown", () => {
		const tableId = "123456";
		const table = [
			["Column 1", "Column 2"],
			[tableId, ""],
			["text", "text"],
			["some text", "some more text"],
		];
		const data = findAppData(table);
		const markdown = appDataToMarkdown(tableId, data);
		expect(markdown).toEqual(
			"| Column 1  | Column 2       |\n| --------- | -------------- |\n| 123456    |                |\n| text      | text           |\n| some text | some more text |"
		);
	});
});

describe("findTableRegex", () => {
	it("produces a regex that matches the data", () => {
		const tableId = "123456";
		const table = [
			["Column 1", "Column 2"],
			[tableId, ""],
			["text", "text"],
			["some text", "some more text"],
		];
		const data = findAppData(table);
		const regex = findTableRegex(tableId, data.headers, data.rows);
		expect(regex.toString()).toEqual(
			"/\\|.*\\|\\n\\|.*\\|\\n\\|[\\t ]+123456[\\t ]+\\|.*\\|\\n\\|.*\\|\\n\\|.*\\|/"
		);

		const string = appDataToMarkdown(tableId, data);
		expect((string.match(regex) || []).length).toEqual(1);
	});
});

describe("findTableId", () => {
	it("returns the table id", () => {
		const parsedTable = [
			["column1", "column2"],
			["12345", ""],
			["text", "text"],
			["test1", "test2"],
		];
		const id = findTableId(parsedTable);
		expect(id).toEqual("12345");
	});

	it("returns null if row doesn't exist", () => {
		const parsedTable = [
			["column1", "column2"],
			["text", "text"],
			["test1", "test2"],
		];
		const id = findTableId(parsedTable);
		expect(id).toEqual(null);
	});

	it("returns null if id is blank", () => {
		const parsedTable = [
			["column1", "column2"],
			["", ""],
			["text", "text"],
			["test1", "test2"],
		];
		const id = findTableId(parsedTable);
		expect(id).toEqual(null);
	});
});

describe("calcColumnCharLengths", () => {
	it("calculates largest string length from header row", () => {
		const tableId = "123456";
		const table = [
			["This is some long text", "Column 2"],
			[tableId, ""],
			["text", "text"],
			["some text", "some more text"],
		];
		const data = findAppData(table);
		const lengths = calcColumnCharLengths(
			tableId,
			data.headers,
			data.cells,
			data.tags
		);
		expect(lengths).toEqual([22, 14]);
	});

	it("calculates largest string length from tableId row", () => {
		const tableId = "this-is-a-long-table-id";
		const table = [
			["Column 1", "Column 2"],
			[tableId, ""],
			["text", "text"],
			["some text", "some more text"],
		];
		const data = findAppData(table);
		const lengths = calcColumnCharLengths(
			tableId,
			data.headers,
			data.cells,
			data.tags
		);
		expect(lengths).toEqual([23, 14]);
	});

	it("calculates largest string length from type definition row", () => {
		const tableId = "123456";
		const table = [
			["Column 1", "Column 2"],
			[tableId, ""],
			["this-is-a-long-value", "text"],
			["some text", "some more text"],
		];
		const data = findAppData(table);
		const lengths = calcColumnCharLengths(
			tableId,
			data.headers,
			data.cells,
			data.tags
		);
		expect(lengths).toEqual([20, 14]);
	});

	it("calculates largest string length from text row", () => {
		const tableId = "123456";
		const table = [
			["Column 1", "Column 2"],
			[tableId, ""],
			["text", "text"],
			["This is a long value", "some more text"],
		];
		const data = findAppData(table);
		const lengths = calcColumnCharLengths(
			tableId,
			data.headers,
			data.cells,
			data.tags
		);
		expect(lengths).toEqual([20, 14]);
	});

	it("calculates largest string length from tag row", () => {
		const tableId = "123456";
		const table = [
			["Column 1", "Column 2"],
			[tableId, ""],
			["tag", "text"],
			["#this-is-a-long-tag", "some more text"],
		];
		const data = findAppData(table);
		const lengths = calcColumnCharLengths(
			tableId,
			data.headers,
			data.cells,
			data.tags
		);
		expect(lengths).toEqual([19, 14]);
	});
});

describe("AppDataStringBuffer", () => {
	it("toString returns current value", () => {
		const buffer = new AppDataStringBuffer();
		buffer.createRow();
		buffer.writeColumn("Column 1", 10);
		buffer.writeColumn("Column 2", 8);
		buffer.createRow();
		buffer.writeColumn("Text", 4);
		expect(buffer.toString()).toEqual(
			"| Column 1   | Column 2 |\n| Text |"
		);
	});
});
