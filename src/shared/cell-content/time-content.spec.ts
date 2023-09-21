import { DateFormat } from "../loom-state/types/loom-state";
import { getTimeCellContent } from "./time-content";

describe("getTimeCellContent", () => {
	it("should return a datetime string if the time is a number", () => {
		const result = getTimeCellContent(1704006000000, DateFormat.MM_DD_YYYY);
		expect(result).toEqual("12/31/2023 12:00 AM");
	});

	it("should return an empty string if time is null", () => {
		const result = getTimeCellContent(null, DateFormat.DD_MM_YYYY);
		expect(result).toEqual("");
	});
});
