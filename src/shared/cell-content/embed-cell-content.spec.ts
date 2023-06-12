import { getEmbedCellContent } from "./embed-cell-content";

describe("getEmbedCellContent", () => {
	it("should return embedded link markdown if renderMarkdown is true", () => {
		const result = getEmbedCellContent("https://youtube.com", true);
		expect(result).toEqual("![](https://youtube.com)");
	});

	it("should return the plain text if renderMarkdown is false", () => {
		const result = getEmbedCellContent("https://youtube.com", false);
		expect(result).toEqual("https://youtube.com");
	});

	it("should return an empty string if not a valid url", () => {
		const result = getEmbedCellContent("url", true);
		expect(result).toEqual("");
	});
});
