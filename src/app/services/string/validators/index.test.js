import { isMarkdownTable, isNumber, isTag, hasSquareBrackets } from ".";

describe("isMarkdownTable", () => {
	it("return true if valid", () => {
		const isValid = isMarkdownTable("| test |\n| ---- |");
		expect(isValid).toEqual(true);
	});

	it("return false if invalid", () => {
		const isValid = isMarkdownTable("");
		expect(isValid).toEqual(false);
	});

	it("return false if hyphen cell count doesn't match header cell count", () => {
		const isValid = isMarkdownTable("| test | test 2 |\n| --- |");
		expect(isValid).toEqual(false);
	});
});

describe("isNumber", () => {
	it("returns true if number", () => {
		const value = isNumber("123456");
		expect(value).toEqual(true);
	});

	it("returns false if a number with a space", () => {
		const value = isNumber("123 567");
		expect(value).toEqual(false);
	});

	it("returns false if text", () => {
		const value = isNumber("ABC123");
		expect(value).toEqual(false);
	});
});

describe("isTag", () => {
	it("matches a tag with a pound sign", () => {
		const value = isTag("#tag");
		expect(value).toEqual(true);
	});

	it("doesn't match multiple tags", () => {
		const value = isTag("#tag1 #tag2");
		expect(value).toEqual(false);
	});

	it("doesn't match tag with spaces", () => {
		const value = isTag("#tag tag");
		expect(value).toEqual(false);
	});
});

describe("hasSquareBrackets", () => {
	it("returns true if has square brackets", () => {
		const output = hasSquareBrackets("[[test file name]]");
		expect(output).toEqual(true);
	});

	it("returns false if doesn't have square brackets", () => {
		const output = hasSquareBrackets("test file name");
		expect(output).toEqual(false);
	});

	it("returns false if square brackets are incomplete", () => {
		const output = hasSquareBrackets("test file name]]");
		expect(output).toEqual(false);
	});
});
