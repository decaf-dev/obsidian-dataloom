import { CELL_TYPE } from "../../../constants";
import {
	findTableRegex,
	calcColumnCharLengths,
	appDataToMarkdown,
	findAppData,
	findTableId,
	AppDataStringBuffer,
} from "./saveUtils";

describe("findAppData", () => {
	it("parses correct ids", () => {
		const parsedTable = [
			["Column 1", "Column 2", "Column 3", ""],
			["text", "text", "text", ""],
			[
				"column-id-123456",
				"column-id-234567",
				"column-id-345678",
				"table-id-123456",
			],
			["Test 1", "Test 2", "Test 3", "row-id-123456"],
		];
		const data = findAppData(parsedTable);
		expect(data.headers.length).toEqual(3);
		expect(data.rows.length).toEqual(1);
		expect(data.cells.length).toEqual(3);
		expect(data.tags.length).toEqual(0);
		expect(data.headers[0].id).toEqual("column-id-123456");
		expect(data.headers[1].id).toEqual("column-id-234567");
		expect(data.headers[2].id).toEqual("column-id-345678");
		expect(data.rows[0].id).toEqual("row-id-123456");
	});

	it("parses column names", () => {
		const parsedTable = [
			["Column 1", "Column 2", "Column 3", ""],
			["text", "text", "text", ""],
			[
				"column-id-123456",
				"column-id-234567",
				"column-id-345678",
				"table-id-123456",
			],
			["Test 1", "Test 2", "Test 3", "row-id-123456"],
		];
		const data = findAppData(parsedTable);
		expect(data.headers[0].content).toEqual("Column 1");
		expect(data.headers[1].content).toEqual("Column 2");
		expect(data.headers[2].content).toEqual("Column 3");
	});

	it("finds text data", () => {
		const parsedTable = [
			["Column 1", "Column 2", "Column 3", ""],
			["text", "text", "text", ""],
			[
				"column-id-123456",
				"column-id-234567",
				"column-id-345678",
				"table-id-123456",
			],
			["Test 1", "Test 2", "Test 3", "row-id-123456"],
		];
		const data = findAppData(parsedTable);
		expect(data.cells[0].toString()).toEqual("Test 1");
		expect(data.cells[1].toString()).toEqual("Test 2");
		expect(data.cells[2].toString()).toEqual("Test 3");
	});

	it("finds tag data", () => {
		const parsedTable = [
			["Column 1", "Column 2", "Column 3", ""],
			["tag", "tag", "tag", ""],
			[
				"column-id-123456",
				"column-id-234567",
				"column-id-345678",
				"table-id-123456",
			],
			["#tag1", "#tag2", "#tag3", "row-id-123456"],
		];
		const data = findAppData(parsedTable);
		expect(data.tags.length).toEqual(3);
		expect(data.tags[0].content).toEqual("tag1");
		expect(data.tags[1].content).toEqual("tag2");
		expect(data.tags[2].content).toEqual("tag3");
	});

	it("finds errors", () => {
		const parsedTable = [
			["Column 1", "Column 2", "Column 3", ""],
			["tag", "tag", "tag", ""],
			[
				"column-id-123456",
				"column-id-234567",
				"column-id-345678",
				"table-id-123456",
			],
			["tag1", "#tag2", "#tag3", "row-id-123456"],
		];
		const data = findAppData(parsedTable);
		expect(data.cells[0].type).toEqual(CELL_TYPE.ERROR);
	});
});

describe("appDataToMarkdown", () => {
	it("converts appData to valid markdown", () => {
		const parsedTable = [
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Test 1", "Test 2", "row-id-123456"],
		];
		const data = findAppData(parsedTable);
		const markdown = appDataToMarkdown("table-id-123456", data);
		expect(markdown).toEqual(
			"| Column 1         | Column 2         |                 |\n| ---------------- | ---------------- | --------------- |\n| text             | text             |                 |\n| column-id-123456 | column-id-234567 | table-id-123456 |\n| Test 1           | Test 2           | row-id-123456   |"
		);
	});
});

describe("findTableRegex", () => {
	it("produces a regex that matches markdown", () => {
		const parsedTable = [
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Test 1", "Test 2", "row-id-123456"],
		];
		const data = findAppData(parsedTable);
		const regex = findTableRegex(
			"table-id-123456",
			data.headers,
			data.rows
		);
		expect(regex.toString()).toEqual(
			"/\\|[ \\t]{0,}Column 1[ \\t]{0,}\\|[ \\t]{0,}Column 2[ \\t]{0,}\\|.*\\|[ ]*\\n\\|[ \\t]{0,}[-]{3,}[ \\t]{0,}\\|[ \\t]{0,}[-]{3,}[ \\t]{0,}\\|[ \\t]{0,}[-]{3,}[ \\t]{0,}\\|[ ]*\\n\\|[ \\t]{0,}text[ \\t]{0,}\\|[ \\t]{0,}text[ \\t]{0,}\\|.*\\|[ ]*\\n\\|[ \\t]{0,}column-id-123456[ \\t]{0,}\\|[ \\t]{0,}column-id-234567[ \\t]{0,}\\|[ \\t]{0,}table-id-123456[ \\t]{0,}\\|[ ]*\\n\\|.*\\|.*\\|.*\\|[ ]*/"
		);

		const string = appDataToMarkdown("table-id-123456", data);
		expect((string.match(regex) || []).length).toEqual(1);
	});
});

describe("findTableId", () => {
	it("returns the table id", () => {
		const parsedTable = [
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["row-id-123456", "row-id-123457", "table-id-123456"],
		];
		const id = findTableId(parsedTable);
		expect(id).toEqual("table-id-123456");
	});

	it("returns null if row doesn't exist", () => {
		const parsedTable = [
			["Column 1", "Column 2", ""],
			["text", "text", ""],
		];
		const id = findTableId(parsedTable);
		expect(id).toEqual(null);
	});

	it("returns null if id is blank", () => {
		const parsedTable = [
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["row-id-123456", "row-id-123457", ""],
		];
		const id = findTableId(parsedTable);
		expect(id).toEqual(null);
	});

	it("returns null if id doesn't contain table-id", () => {
		const parsedTable = [
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["row-id-123456", "row-id-123457", "123456"],
		];
		const id = findTableId(parsedTable);
		expect(id).toEqual(null);
	});
});

describe("calcColumnCharLengths", () => {
	it("calculates largest string length", () => {
		const parsedTable = [
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Test 1", "Test 2", "row-id-123456"],
		];
		const data = findAppData(parsedTable);
		const lengths = calcColumnCharLengths("table-id-123456", data);
		expect(lengths).toEqual([16, 16, 15]);
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
