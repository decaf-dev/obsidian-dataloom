import { getWikiLinkText, stripFileExtension } from "./link-utils";

describe("stripFileExtension", () => {
	it("strips the file extension", () => {
		const result = stripFileExtension("abc.md");
		expect(result).toEqual("abc");
	});
});

describe("getWikiLinkText", () => {
	it("handles a unique name, markdown file", () => {
		const result = getWikiLinkText(
			{
				basename: "filename",
				name: "filename.md",
				extension: "md",
				path: "my/path/filename.md",
			},
			true
		);
		expect(result).toEqual("filename");
	});

	it("handles a non-unique name, markdown file", () => {
		const result = getWikiLinkText(
			{
				basename: "filename",
				name: "filename.md",
				extension: "md",
				path: "my/path/filename.md",
			},
			false
		);
		expect(result).toEqual("my/path/filename|filename");
	});

	it("handles a unique name, table file", () => {
		const result = getWikiLinkText(
			{
				basename: "filename",
				name: "filename.table",
				extension: "table",
				path: "my/path/filename.table",
			},
			true
		);
		expect(result).toEqual("filename.table");
	});

	it("handles a non-unique name, table file", () => {
		const result = getWikiLinkText(
			{
				basename: "filename",
				name: "filename.table",
				extension: "table",
				path: "my/path/filename.table",
			},
			false
		);
		expect(result).toEqual("my/path/filename.table|filename");
	});
});
