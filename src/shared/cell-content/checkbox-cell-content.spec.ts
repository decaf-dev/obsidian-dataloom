import { getCheckboxCellContent } from "./checkbox-cell-content";

describe("getCheckboxCellContent", () => {
	it("should return true if markdown is checked", () => {
		const result = getCheckboxCellContent(true, true);
		expect(result).toEqual("true");
	});

	it("should return false if markdown not checked", () => {
		const result = getCheckboxCellContent(false, true);
		expect(result).toEqual("false");
	});

	it("should return the unchecked markdown if renderMarkdown is true", () => {
		const result = getCheckboxCellContent(true, false);
		expect(result).toEqual("[x]");
	});

	it("should return the checked markdown if renderMarkdown is true", () => {
		const result = getCheckboxCellContent(false, false);
		expect(result).toEqual("[ ]");
	});
});
