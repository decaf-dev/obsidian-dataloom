import { getFileCellContent } from "./file-cell-content";

describe("getFileCellContent", () => {
	it("returns a wiki link for the entire text", () => {
		const result = getFileCellContent("some text");
		expect(result).toEqual("[[some text]]");
	});

	it("returns a wiki link for the text before the first link", () => {
		const result = getFileCellContent("some text [[my-file|alias]]");
		expect(result).toEqual("[[some text]]");
	});

	it("returns the first wiki link", () => {
		const result = getFileCellContent(
			"[[my-file|alias]] some text [[another-file]]"
		);
		expect(result).toEqual("[[my-file|alias]]");
	});
});
