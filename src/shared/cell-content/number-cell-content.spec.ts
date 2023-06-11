import { getNumberCellContent } from "./number-cell-content";

describe("getNumberCellContent", () => {
	it("should return the number if value is a number", () => {
		const result = getNumberCellContent("123");
		expect(result).toEqual("123");
	});

	it("should return an empty string if value is not a number", () => {
		const result = getNumberCellContent("abc123");
		expect(result).toEqual("");
	});
});
