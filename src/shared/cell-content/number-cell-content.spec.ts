import { CurrencyType, NumberFormat } from "../loom-state/types/loom-state";
import { getNumberCellContent } from "./number-cell-content";

describe("getNumberCellContent", () => {
	it("should return the number if value is a number", () => {
		const result = getNumberCellContent(NumberFormat.NUMBER, "123");
		expect(result).toEqual("123");
	});

	it("should return an empty string if value is not a number", () => {
		const result = getNumberCellContent(NumberFormat.NUMBER, "abc123");
		expect(result).toEqual("");
	});

	it("should return a currency string if value is a number and format is currency", () => {
		const result = getNumberCellContent(NumberFormat.CURRENCY, "123", {
			currency: CurrencyType.UNITED_STATES,
		});
		expect(result).toEqual("$123.00");
	});
});
