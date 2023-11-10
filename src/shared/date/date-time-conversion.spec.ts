import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { dateTimeToDateString } from "./date-time-conversion";

describe("dateTimeToDateString", () => {
	// Group for normal cases
	describe("Normal Cases", () => {
		const testDate = "2020-12-31T23:59:59Z"; // An arbitrary fixed date-time
		const options = {
			locale: "en-US",
			includeTime: false,
			hour12: true,
		};

		it("formats date with MM_DD_YYYY format and SLASH separator correctly", () => {
			// Arrange
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.SLASH;

			// Act
			const result = dateTimeToDateString(
				testDate,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual("12/31/2020");
		});

		it("formats date with DD_MM_YYYY format and HYPHEN separator correctly", () => {
			// Arrange
			const format = DateFormat.DD_MM_YYYY;
			const separator = DateFormatSeparator.HYPHEN;

			// Act
			const result = dateTimeToDateString(
				testDate,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual("31-12-2020");
		});

		it("formats date with YYYY_MM_DD format and DOT separator correctly", () => {
			// Arrange
			const format = DateFormat.YYYY_MM_DD;
			const separator = DateFormatSeparator.DOT;

			// Act
			const result = dateTimeToDateString(
				testDate,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual("2020.12.31");
		});

		it("includes time when includeTime is true", () => {
			// Arrange
			options.includeTime = true;
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.DOT;

			// Act
			const result = dateTimeToDateString(
				testDate,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toMatch(/\d{2}\.\d{2}\.2020 \d{1,2}:\d{2} (AM|PM)/); // The time is locale and timezone dependent
		});

		it("omits time when includeTime is false", () => {
			// Arrange
			options.includeTime = false;
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.SLASH;

			// Act
			const result = dateTimeToDateString(
				testDate,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual("12/31/2020");
		});
	});

	// Group for edge cases
	describe("Edge Cases", () => {
		it("handles end of month correctly", () => {
			// Arrange
			const endOfMonthDate = "2020-01-31T23:59:59Z"; // End of January
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.SLASH;
			const options = { includeTime: false };

			// Act
			const result = dateTimeToDateString(
				endOfMonthDate,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual("01/31/2020");
		});

		it("handles the start of a year correctly", () => {
			// Arrange
			const startOfYearDate = "2020-01-01T00:00:00Z"; // Start of the year
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.SLASH;
			const options = { includeTime: false, locale: "en-US" };

			// Act
			const result = dateTimeToDateString(
				startOfYearDate,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual(
				new Date("2020-01-01T00:00:00Z").toLocaleDateString(
					options.locale,
					{
						month: "2-digit",
						day: "2-digit",
						year: "numeric",
					}
				)
			);
		});
	});
});
