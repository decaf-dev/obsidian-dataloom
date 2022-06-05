import { CELL_TYPE } from "../../../constants";
import {
	findTableRegex,
	calcColumnCharLengths,
	appDataToMarkdown,
	findAppData,
	AppDataStringBuffer,
} from "./saveUtils";

describe("findAppData", () => {
	it("finds headers", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
			["Cell 3", "Cell 4"],
		];
		const data = findAppData(parsedTable);
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
		const data = findAppData(parsedTable);
		expect(data.cells.length).toEqual(4);
		expect(data.cells[0].toString()).toEqual("Cell 1");
		expect(data.cells[1].toString()).toEqual("Cell 2");
		expect(data.cells[2].toString()).toEqual("Cell 3");
		expect(data.cells[3].toString()).toEqual("Cell 4");
	});

	it("finds tag data", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["#tag1", "#tag2"],
			["#tag3", "#tag4"],
		];
		const data = findAppData(parsedTable);
		expect(data.tags.length).toEqual(4);
		expect(data.tags[0].content).toEqual("tag1");
		expect(data.tags[1].content).toEqual("tag2");
		expect(data.tags[2].content).toEqual("tag3");
		expect(data.tags[3].content).toEqual("tag4");
	});

	it("finds errors", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["#tag1", "#tag2"],
			["Cell 1", "Cell 2"],
		];
		const data = findAppData(parsedTable);
		expect(data.cells[3].type).toEqual(CELL_TYPE.ERROR);
	});
});

describe("appDataToMarkdown", () => {
	it("converts appData to valid markdown", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
		];
		const data = findAppData(parsedTable);
		const markdown = appDataToMarkdown(data);
		expect(markdown).toEqual(
			"| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |"
		);
	});
});

describe("findTableRegex", () => {
	it("produces a regex that matches markdown", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
		];
		const data = findAppData(parsedTable);
		const regex = findTableRegex(data.headers, data.rows);
		expect(regex.toString()).toEqual(
			"/\\|[ \\t]{0,}Column 1[ \\t]{0,}\\|[ \\t]{0,}Column 2[ \\t]{0,}\\|\\n\\|[ \\t]{0,}[-]{3,}[ \\t]{0,}\\|[ \\t]{0,}[-]{3,}[ \\t]{0,}\\|\\n\\|.*\\|.*\\|/"
		);

		const string = appDataToMarkdown(data);
		expect((string.match(regex) || []).length).toEqual(1);
	});
});

describe("calcColumnCharLengths", () => {
	it("calculates largest string length", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Test 1", "Test 2"],
		];
		const data = findAppData(parsedTable);
		const lengths = calcColumnCharLengths(data);
		expect(lengths).toEqual([8, 8]);
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
