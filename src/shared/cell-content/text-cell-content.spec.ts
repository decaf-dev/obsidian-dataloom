import { getTextCellContent } from "./text-cell-content";

describe("getTextCellContent", () => {
	it("should return markdown if renderMarkdown is true", () => {
		const result = getTextCellContent("[[inbox/filename|filename]]", false);
		expect(result).toEqual("[[inbox/filename|filename]]");
	});

	it("should return the text if renderMarkdown is false", () => {
		const result = getTextCellContent("[[inbox/filename|filename]]", true);
		expect(result).toEqual("inbox/filename");
	});
});
