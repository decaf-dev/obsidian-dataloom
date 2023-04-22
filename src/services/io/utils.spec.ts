import { getFilePathExtension } from "./utils";

describe("getFilePathExtension", () => {
	test("returns the extension", () => {
		const result = getFilePathExtension("abc.md");
		expect(result).toEqual({
			pathWithoutExtension: "abc",
			extension: ".md",
		});
	});
	test("gets the last file extension", () => {
		const result = getFilePathExtension("abc.test.md");
		expect(result).toEqual({
			pathWithoutExtension: "abc.test",
			extension: ".md",
		});
	});
	test("returns null when no extension is present", () => {
		const result = getFilePathExtension("abc");
		expect(result).toEqual(null);
	});
});
