import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { dateStringToDateTime } from "./date-string-conversion";

describe("dateStringToDateTime", () => {
	describe("normal cases", () => {
		it("converts MM-DD-YYYY format correctly without time", () => {
			// Arrange
			const dateString = "12-31-2020";
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.HYPHEN;

			// Act
			const result = dateStringToDateTime(dateString, format, separator);

			// Assert
			expect(result).toEqual(
				new Date("2020-12-31T00:00:00").toISOString()
			);
		});

		it("converts DD/MM/YYYY format correctly without time", () => {
			// Arrange
			const dateString = "31/12/2020";
			const format = DateFormat.DD_MM_YYYY;
			const separator = DateFormatSeparator.SLASH;

			// Act
			const result = dateStringToDateTime(dateString, format, separator);

			// Assert
			expect(result).toEqual(
				new Date("2020-12-31T00:00:00").toISOString()
			);
		});

		it("converts YYYY.MM.DD format correctly with 24-hour time", () => {
			// Arrange
			const dateString = "2020.12.31";
			const format = DateFormat.YYYY_MM_DD;
			const separator = DateFormatSeparator.DOT;
			const options = { timeString: "23:59", hour12: false };

			// Act
			const result = dateStringToDateTime(
				dateString,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual(
				new Date("2020-12-31T23:59:00").toISOString()
			);
		});

		it("converts MM-DD-YYYY format correctly with 12-hour time", () => {
			// Arrange
			const dateString = "12-31-2020";
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.HYPHEN;
			const options = { timeString: "11:59 PM", hour12: true };

			// Act
			const result = dateStringToDateTime(
				dateString,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual(
				new Date("2020-12-31T23:59:00").toISOString()
			);
		});
	});

	describe("invalid cases", () => {
		it("returns invalid date string for MM-DD-YYYY format with incorrect date string", () => {
			// Arrange
			const dateString = "2020-12-31";
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.HYPHEN;

			//Act and Assert
			expect(() =>
				dateStringToDateTime(dateString, format, separator)
			).toThrowError();
		});

		it("returns invalid time string for DD/MM/YYYY format with incorrect time string", () => {
			// Arrange
			const dateString = "31/12/2020";
			const format = DateFormat.DD_MM_YYYY;
			const separator = DateFormatSeparator.SLASH;
			const options = { timeString: "11:60 PM", hour12: true };

			//Act and Assert
			expect(() =>
				dateStringToDateTime(dateString, format, separator, options)
			).toThrowError();
		});
	});

	describe("edge cases", () => {
		it("converts start of the year MM-DD-YYYY format correctly without time", () => {
			// Arrange
			const dateString = "01-01-2020";
			const format = DateFormat.MM_DD_YYYY;
			const separator = DateFormatSeparator.HYPHEN;

			// Act
			const result = dateStringToDateTime(dateString, format, separator);

			// Assert
			expect(result).toEqual(
				new Date("2020-01-01T00:00:00").toISOString()
			);
		});

		it("converts end of the year YYYY/MM/DD format correctly with midnight time", () => {
			// Arrange
			const dateString = "2020/12/31";
			const format = DateFormat.YYYY_MM_DD;
			const separator = DateFormatSeparator.SLASH;
			const options = { timeString: "00:00", hour12: false };

			// Act
			const result = dateStringToDateTime(
				dateString,
				format,
				separator,
				options
			);

			// Assert
			expect(result).toEqual(
				new Date("2020-12-31T00:00:00").toISOString()
			);
		});
	});
});
