import { splitFileExtension } from "./utils";

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
