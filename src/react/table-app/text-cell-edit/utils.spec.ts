import {
	isSurroundedByDoubleBrackets,
	replaceDoubleBracketText,
} from "./utils";

describe("isSurroundedByDoubleBrackets", () => {
	it("should return false when there are no double brackets", () => {
		const result = isSurroundedByDoubleBrackets("abc [file] 123", 5);
		expect(result).toEqual(false);
	});

	it("should return false when the index is not in the double brackets", () => {
		const result = isSurroundedByDoubleBrackets("abc [[file]] 123", 2);
		expect(result).toEqual(false);
	});

	it("should return true if the index is in empty double brackets", () => {
		const result = isSurroundedByDoubleBrackets("abc [[]] 123", 5);
		expect(result).toEqual(true);
	});

	it("should return true if the index is in double brackets", () => {
		const result = isSurroundedByDoubleBrackets("abc [[file]] 123", 6);
		expect(result).toEqual(true);
	});

	it("should return true if the index is in double brackets", () => {
		const result = isSurroundedByDoubleBrackets("abc [[file]] 123", 10);
		expect(result).toEqual(true);
	});
});

describe("replaceDoubleBracketText", () => {
	it("should append the replacement if empty double brackets", () => {
		const result = replaceDoubleBracketText("abc [[]] 123", 5, "new");
		expect(result).toEqual("abc [[new]] 123");
	});

	it("should replace if double brackets", () => {
		const result = replaceDoubleBracketText("abc [[file]] 123", 7, "new");
		expect(result).toEqual("abc [[new]] 123");
	});
});
