import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { isValidDateString } from "./date-validation";

describe("isValidDateString", () => {
	// Test cases for valid date strings
	it("returns true for valid date strings with different formats and separators", () => {
		expect(
			isValidDateString(
				"12/31/2020",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(true);

		expect(
			isValidDateString(
				"31-12-2020",
				DateFormat.DD_MM_YYYY,
				DateFormatSeparator.HYPHEN
			)
		).toEqual(true);

		expect(
			isValidDateString(
				"2020.12.31",
				DateFormat.YYYY_MM_DD,
				DateFormatSeparator.DOT
			)
		).toEqual(true);
	});

	// Test cases for invalid date strings
	it("returns false for invalid date strings", () => {
		expect(
			isValidDateString(
				"12/31/20",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(false);
		expect(
			isValidDateString(
				"31-12-20",
				DateFormat.DD_MM_YYYY,
				DateFormatSeparator.HYPHEN
			)
		).toEqual(false);
		expect(
			isValidDateString(
				"2020.31.12",
				DateFormat.YYYY_MM_DD,
				DateFormatSeparator.DOT
			)
		).toEqual(false);
	});

	// Test cases for edge cases
	it("handles edge cases correctly", () => {
		expect(
			isValidDateString(
				"02/29/2020",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(true); // Leap year

		expect(
			isValidDateString(
				"02/29/2021",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(false); // Not a leap year

		expect(
			isValidDateString(
				"01/1/2020",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(true); // Single-digit day

		expect(
			isValidDateString(
				"1/01/2020",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(true); // Single-digit month
	});

	// Test cases for error handling
	it("throws an error for unsupported date formats", () => {
		expect(() =>
			isValidDateString(
				"yesterday",
				DateFormat.RELATIVE,
				DateFormatSeparator.SLASH
			)
		).toThrow("Date format not supported.");
	});
});
