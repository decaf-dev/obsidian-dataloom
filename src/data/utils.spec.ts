import { splitFileExtension, updateLinkReferences } from "./utils";

describe("splitFileExtension", () => {
	test("returns the extension", () => {
		const result = splitFileExtension("abc.md");
		expect(result).toEqual(["abc", ".md"]);
	});
	test("gets the last file extension", () => {
		const result = splitFileExtension("abc.test.md");
		expect(result).toEqual(["abc.test", ".md"]);
	});
	test("returns null when no extension is present", () => {
		const result = splitFileExtension("abc");
		expect(result).toEqual(null);
	});
});

describe("updateLinkReferences", () => {
	it("returns same link when the path didn't change", () => {
		const result = updateLinkReferences(
			"[[my/path/filename|filename]]",
			"my/path/filename.md",
			"my/path/filename.md"
		);
		expect(result).toEqual("[[my/path/filename|filename]]");
	});

	it("returns an updated link when the path has changed", () => {
		const result = updateLinkReferences(
			"[[my/path/filename|filename]]",
			"my/path/updated.md",
			"my/path/filename.md"
		);
		expect(result).toEqual("[[my/path/updated|updated]]");
	});
});
