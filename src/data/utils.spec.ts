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
	it("handles no change in the file name", () => {
		const result = updateLinkReferences(
			"[[filename]]",
			{
				basename: "filename",
				name: "filename.md",
				extension: "md",
				path: "my/path/filename.md",
			},
			"my/path/filename.md",
			true
		);
		expect(result).toEqual("[[filename]]");
	});

	it("handles when the file name is now unique", () => {
		const result = updateLinkReferences(
			"[[my/path/filename|filename]]",
			{
				basename: "filename",
				name: "filename.md",
				extension: "md",
				path: "my/path/filename.md",
			},
			"my/path/filename.md",
			true
		);
		expect(result).toEqual("[[filename]]");
	});

	it("handles when the file name is now non-unique", () => {
		const result = updateLinkReferences(
			"[[filename]]",
			{
				basename: "filename",
				name: "filename.md",
				extension: "md",
				path: "my/path/filename.md",
			},
			"my/path/filename.md",
			false
		);
		expect(result).toEqual("[[my/path/filename|filename]]");
	});

	it("handles when the file name changes and is unique", () => {
		const result = updateLinkReferences(
			"[[filename]]",
			{
				basename: "new-filename",
				name: "new-filename.md",
				extension: "md",
				path: "my/path/new-filename.md",
			},
			"my/path/filename.md",
			true
		);
		expect(result).toEqual("[[new-filename]]");
	});

	it("handles when the file names changes and is non-unique", () => {
		const result = updateLinkReferences(
			"[[filename]]",
			{
				basename: "new-filename",
				name: "new-filename.md",
				extension: "md",
				path: "my/path/new-filename.md",
			},
			"my/path/filename.md",
			false
		);
		expect(result).toEqual("[[my/path/new-filename|new-filename]]");
	});

	it("handles when a table name changes and is unique", () => {
		const result = updateLinkReferences(
			"[[my/path/filename.table|filename]]",
			{
				basename: "new-filename",
				name: "new-filename.table",
				extension: "table",
				path: "my/path/new-filename.table",
			},
			"my/path/filename.table",
			true
		);
		expect(result).toEqual("[[new-filename.table]]");
	});

	it("handles when a table name changes and is non-unique", () => {
		const result = updateLinkReferences(
			"[[filename.table]]",
			{
				basename: "new-filename",
				name: "new-filename.table",
				extension: "table",
				path: "my/path/new-filename.table",
			},
			"my/path/filename.table",
			false
		);
		expect(result).toEqual("[[my/path/new-filename.table|new-filename]]");
	});
});
