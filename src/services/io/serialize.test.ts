import { randomCellId, randomColumnId, randomRowId } from "../random";
import { calcColumnCharLengths, TableModelStringBuffer } from "./serialize";

describe("calcColumnCharLengths", () => {
	it("calculates lengths", () => {
		const columnId1 = randomColumnId();
		const columnId2 = randomColumnId();
		const cells = [
			{
				id: randomCellId(),
				markdown: "short",
				html: "short",
				columnId: columnId1,
				rowId: randomRowId(),
			},
			{
				id: randomCellId(),
				markdown: "shorter",
				html: "shorter",
				columnId: columnId1,
				rowId: randomRowId(),
			},
			{
				id: randomCellId(),
				markdown: "",
				html: "",
				columnId: columnId2,
				rowId: randomRowId(),
			},
		];
		const lengths = calcColumnCharLengths(cells);
		expect(lengths).toEqual({ [columnId1]: 7, [columnId2]: 0 });
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
