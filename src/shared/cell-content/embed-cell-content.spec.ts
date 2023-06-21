import { getEmbedCellContent } from "./embed-cell-content";

describe("getEmbedCellContent", () => {
	it("should return embedded link markdown if isExternal and renderMarkdown are true", () => {
		const result = getEmbedCellContent(true, true, "https://youtube.com");
		expect(result).toEqual("![](https://youtube.com)");
	});

	it("should return the plain text if renderMarkdown is false", () => {
		const result = getEmbedCellContent(false, true, "https://youtube.com");
		expect(result).toEqual("https://youtube.com");
	});

	it("should return the markdown when isExternal is false", () => {
		const result = getEmbedCellContent(
			true,
			false,
			"tables/filename.table"
		);
		expect(result).toEqual("tables/filename.table");
	});
});
