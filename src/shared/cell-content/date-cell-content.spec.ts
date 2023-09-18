import { DateFormat } from "../loom-state/types/loom-state";
import { getDateCellContent } from "./date-cell-content";

describe("getDateCellContent", () => {
	it("should return a date string if the time is a number", () => {
		const result = getDateCellContent(1704006000000, DateFormat.MM_DD_YYYY);
		expect(result).toEqual("12/31/2023");
	});

	it("should return an empty string if time is null", () => {
		const result = getDateCellContent(null, DateFormat.DD_MM_YYYY);
		expect(result).toEqual("");
	});
});
