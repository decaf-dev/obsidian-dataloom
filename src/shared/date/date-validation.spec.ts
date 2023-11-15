import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { isValidDateString, isValidTimeString } from "./date-validation";

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

describe("isValidTimeString", () => {
	// Normal cases
	describe("Normal cases", () => {
		it("should return true for a valid 24-hour format time string", () => {
			//Arrange
			const time = "13:45";
			const hour12 = false;

			//Act
			const result = isValidTimeString(time, hour12);

			//Assert
			expect(result).toEqual(true);
		});

		it("should return true for a valid 12-hour format time string", () => {
			//Arrange
			const time = "1:45 PM";
			const hour12 = true;

			//Act
			const result = isValidTimeString(time, hour12);

			//Assert
			expect(result).toEqual(true);
		});
	});

	// Invalid cases
	describe("Invalid cases", () => {
		it("should return false for an invalid time string", () => {
			//Arrange
			const time = "25:67";
			const hour12 = false;

			//Act
			const result = isValidTimeString(time, hour12);

			//Assert
			expect(result).toEqual(false);
		});

		it("should return false for a valid time string with incorrect hour12 flag", () => {
			//Arrange
			const time = "13:45";
			const hour12 = true;

			//Act
			const result = isValidTimeString(time, hour12);

			//Assert
			expect(result).toEqual(false);
		});
	});

	// Edge cases
	describe("Edge cases", () => {
		it("should return true for the start of the day in 24-hour format", () => {
			//Arrange
			const time = "00:00";
			const hour12 = false;

			//Act
			const result = isValidTimeString(time, hour12);

			//Assert
			expect(result).toEqual(true);
		});

		it("should return true for the end of the day in 12-hour format", () => {
			//Arrange
			const time = "11:59 PM";
			const hour12 = true;

			//Act
			const result = isValidTimeString(time, hour12);

			//Assert
			expect(result).toEqual(true);
		});

		it("should return true for a single-digit hour in 24-hour format", () => {
			//Arrange
			const time = "01:00";
			const hour12 = false;

			//Act
			const result = isValidTimeString(time, hour12);

			//Assert
			expect(result).toEqual(true);
		});
	});

	// Error cases
	describe("Error cases", () => {
		it("should return false for a string that does not match any time format", () => {
			//Arrange
			const time = "not a time";
			const hour12 = false;

			//Act
			const result = isValidTimeString(time, hour12);

			//Assert
			expect(result).toEqual(false);
		});
	});
});
