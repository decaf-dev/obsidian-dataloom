import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { getTimeCellContent } from "./time-content";

describe("getTimeCellContent", () => {
	it("should return a datetime string if the time is a number", () => {
		const result = getTimeCellContent(
			"2020-12-31T00:00:00Z",
			DateFormat.MM_DD_YYYY,
			DateFormatSeparator.HYPHEN,
			true
		);
		expect(result).toEqual("12-30-2020 5:00 PM");
	});

	it("should return an empty string if time is null", () => {
		const result = getTimeCellContent(
			null,
			DateFormat.DD_MM_YYYY,
			DateFormatSeparator.HYPHEN,
			true
		);
		expect(result).toEqual("");
	});
});
