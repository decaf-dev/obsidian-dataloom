import { CurrencyType } from "../loom-state/types/loom-state";
import { getCurrencyCellContent } from "./currency-cell-content";

describe("getCurrencyCellContent", () => {
	it("should return the currency string if value is a number", () => {
		const result = getCurrencyCellContent(
			"123",
			CurrencyType.UNITED_STATES
		);
		expect(result).toEqual("$123.00");
	});

	it("should return an empty string if value is not a number", () => {
		const result = getCurrencyCellContent(
			"abc123",
			CurrencyType.UNITED_STATES
		);
		expect(result).toEqual("");
	});
});
