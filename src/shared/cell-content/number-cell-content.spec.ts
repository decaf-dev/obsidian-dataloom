import { CurrencyType, NumberFormat } from "../loom-state/types/loom-state";
import { getNumberCellContent } from "./number-cell-content";

describe("getNumberCellContent", () => {
	it("should return the number if value is a number", () => {
		const result = getNumberCellContent(
			NumberFormat.NUMBER,
			CurrencyType.UNITED_STATES,
			"123"
		);
		expect(result).toEqual("123");
	});

	it("should return an empty string if value is not a number", () => {
		const result = getNumberCellContent(
			NumberFormat.NUMBER,
			CurrencyType.UNITED_STATES,
			"abc123"
		);
		expect(result).toEqual("");
	});

	it("should return a currency string if value is a number and format is currency", () => {
		const result = getNumberCellContent(
			NumberFormat.CURRENCY,
			CurrencyType.UNITED_STATES,
			"123"
		);
		expect(result).toEqual("$123.00");
	});
});
