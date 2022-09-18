import {
	calcColumnCharLengths,
	tableModelToMarkdown,
	TableModelStringBuffer,
} from "./saveUtils";

import { findTableModel } from "./loadUtils";

//TODO write
// describe("tableModelToMarkdown", () => {
// 	it("converts appData to valid markdown", () => {
// 		const parsedTable = [
// 			["Column 1", "Column 2"],
// 			["Cell 1", "Cell 2"],
// 		];
// 		const data = findTableModel(parsedTable, parsedTable);
// 		const markdown = tableModelToMarkdown(data);
// 		expect(markdown).toEqual(
// 			"| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |"
// 		);
// 	});
// });

describe("calcColumnCharLengths", () => {
	it("calculates lengths", () => {
		const cells = [
			{
				id: "cell-1",
				content: "short",
				textContent: "short",
			},
			{
				id: "cell-2",
				content: "shorter",
				textContent: "shorter",
			},
			{
				id: "cell-3",
				content: "longer",
				textContent: "longer",
			},
			{
				id: "cell-4",
				content: "long",
				textContent: "long",
			},
		];
		const lengths = calcColumnCharLengths(cells, 2);
		expect(lengths).toEqual({ "0": 6, "1": 7 });
	});
});

describe("TableModelStringBuffer", () => {
	it("toString returns current value", () => {
		const buffer = new TableModelStringBuffer();
		buffer.createRow();
		buffer.writeCell("Column 1", 10);
		buffer.writeCell("Column 2", 8);
		buffer.createRow();
		buffer.writeCell("Text", 4);
		expect(buffer.toString()).toEqual(
			"| Column 1   | Column 2 |\n| Text |"
		);
	});
});
