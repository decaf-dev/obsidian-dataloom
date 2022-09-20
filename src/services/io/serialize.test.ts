import { calcColumnCharLengths, TableModelStringBuffer } from "./serialize";

describe("calcColumnCharLengths", () => {
	it("calculates lengths", () => {
		const cells = [
			{
				id: "",
				markdown: "short",
				html: "short",
				columnId: "",
				rowId: "",
			},
			{
				id: "",
				markdown: "shorter",
				html: "shorter",
				columnId: "",
				rowId: "",
			},
			{
				id: "",
				markdown: "longer",
				html: "longer",
				columnId: "",
				rowId: "",
			},
			{
				id: "",
				markdown: "long",
				html: "long",
				columnId: "",
				rowId: "",
			},
		];
		const lengths = calcColumnCharLengths(cells);
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
