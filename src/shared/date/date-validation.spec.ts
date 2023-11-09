import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { isValidDateString } from "./date-validation";

describe("isValidDateString", () => {
	//Test cases for valid date strings
	it("returns true for valid date string with MM_DD_YYYY and slash separator", () => {
		const result = isValidDateString(
			"12/31/2020",
			DateFormat.MM_DD_YYYY,
			DateFormatSeparator.SLASH
		);
		expect(result).toEqual(true);
	});

	it("returns true for valid date string with DD_MM_YYYY and slash separator", () => {
		const result = isValidDateString(
			"31/12/2020",
			DateFormat.DD_MM_YYYY,
			DateFormatSeparator.SLASH
		);
		expect(result).toEqual(true);
	});

	it("returns true for valid date string with YYYY_MM_DDDD and slash separator", () => {
		const result = isValidDateString(
			"2020/12/31",
			DateFormat.YYYY_MM_DD,
			DateFormatSeparator.SLASH
		);
		expect(result).toEqual(true);
	});

	it("returns true for valid date string with MM_DD_YYYY and hyphen separator", () => {
		const result = isValidDateString(
			"12-31-2020",
			DateFormat.MM_DD_YYYY,
			DateFormatSeparator.HYPHEN
		);
		expect(result).toEqual(true);
	});

	it("returns true for valid date string with DD_MM_YYYY and hyphen separator", () => {
		const result = isValidDateString(
			"31-12-2020",
			DateFormat.DD_MM_YYYY,
			DateFormatSeparator.HYPHEN
		);
		expect(result).toEqual(true);
	});

	it("returns true for valid date string with YYYY_MM_DDDD and hyphen separator", () => {
		const result = isValidDateString(
			"2020-12-31",
			DateFormat.YYYY_MM_DD,
			DateFormatSeparator.HYPHEN
		);
		expect(result).toEqual(true);
	});

	it("returns true for valid date string with MM_DD_YYYY and dot separator", () => {
		const result = isValidDateString(
			"12.31.2020",
			DateFormat.MM_DD_YYYY,
			DateFormatSeparator.DOT
		);
		expect(result).toEqual(true);
	});

	it("returns true for valid date string with DD_MM_YYYY and dot separator", () => {
		const result = isValidDateString(
			"31.12.2020",
			DateFormat.DD_MM_YYYY,
			DateFormatSeparator.DOT
		);
		expect(result).toEqual(true);
	});

	it("returns true for valid date string with YYYY_MM_DDDD and dot separator", () => {
		const result = isValidDateString(
			"2020.12.31",
			DateFormat.YYYY_MM_DD,
			DateFormatSeparator.DOT
		);
		expect(result).toEqual(true);
	});

	// Test cases for invalid date strings
	it("returns false for switched month and day", () => {
		const result = isValidDateString(
			"12/31/2020",
			DateFormat.DD_MM_YYYY,
			DateFormatSeparator.SLASH
		);
		expect(result).toEqual(false);
	});

	it("returns false for wrong separator", () => {
		const result = isValidDateString(
			"12-31-2020",
			DateFormat.DD_MM_YYYY,
			DateFormatSeparator.SLASH
		);
		expect(result).toEqual(false);
	});

	// Test cases for edge cases
	it("returns false for single-digit day", () => {
		expect(
			isValidDateString(
				"01/1/2020",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(false);
	});

	it("returns false for single-digit month", () => {
		expect(
			isValidDateString(
				"1/01/2020",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(false);
	});

	it("returns false for two-digit year", () => {
		expect(
			isValidDateString(
				"01/01/20",
				DateFormat.MM_DD_YYYY,
				DateFormatSeparator.SLASH
			)
		).toEqual(false);
	});
});
