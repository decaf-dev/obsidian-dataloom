import {
	calcColumnCharLengths,
	tableModelToMarkdown,
	TableModelStringBuffer,
} from "./saveUtils";

import { findTableModel } from "./loadUtils";

describe("tableModelToMarkdown", () => {
	it("converts appData to valid markdown", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
		];
		const data = findTableModel(parsedTable, parsedTable);
		const markdown = tableModelToMarkdown(data);
		expect(markdown).toEqual(
			"| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |"
		);
	});
});

describe("calcColumnCharLengths", () => {
	it("calculates largest string length", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Test 1", "Test 2"],
		];
		const data = findTableModel(parsedTable, parsedTable);
		const lengths = calcColumnCharLengths(data);
		expect(lengths).toEqual([8, 8]);
	});
});

describe("TableModelStringBuffer", () => {
	it("toString returns current value", () => {
		const buffer = new TableModelStringBuffer();
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
