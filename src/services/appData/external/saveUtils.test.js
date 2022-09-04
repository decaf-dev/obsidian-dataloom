import {
	calcColumnCharLengths,
	appDataToMarkdown,
	AppDataStringBuffer,
} from "./saveUtils";

import { findAppData } from "./loadUtils";

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
