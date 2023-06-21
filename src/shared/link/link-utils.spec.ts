import {
	getBasename,
	getWikiLinkText,
	stripDirectory,
	stripFileExtension,
} from "./link-utils";

describe("stripFileExtension", () => {
	it("strips the file extension", () => {
		const result = stripFileExtension("abc.md");
		expect(result).toEqual("abc");
	});
});

describe("stripDirectory", () => {
	it("strips the absolute path", () => {
		const result = stripDirectory("my/path/abc.md");
		expect(result).toEqual("abc.md");
	});
});

describe("getBasename", () => {
	it("gets the basename", () => {
		const result = getBasename("my/path/abc.md");
		expect(result).toEqual("abc");
	});
});

describe("getWikiLinkText", () => {
	it("handles a file path with no directory", () => {
		const result = getWikiLinkText("filename.md");
		expect(result).toEqual("filename");
	});

	it("handles a file path with a directory", () => {
		const result = getWikiLinkText("my/path/filename.md");
		expect(result).toEqual("my/path/filename|filename");
	});
});
