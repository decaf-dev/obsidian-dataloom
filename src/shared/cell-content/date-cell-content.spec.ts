import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { getDateCellContent } from "./date-cell-content";

describe("getDateCellContent", () => {
	// Normal cases
	it('returns formatted date string with MM_DD_YYYY format and "-" separator', () => {
		const result = getDateCellContent(
			"2020-01-01T23:00:00Z",
			DateFormat.MM_DD_YYYY,
			DateFormatSeparator.HYPHEN,
			false,
			true
		);
		expect(result).toEqual("01-01-2020");
	});

	// Invalid cases
	it("returns an empty string when dateTime is null", () => {
		const result = getDateCellContent(
			null,
			DateFormat.MM_DD_YYYY,
			DateFormatSeparator.HYPHEN,
			false,
			true
		);
		expect(result).toEqual("");
	});
});
