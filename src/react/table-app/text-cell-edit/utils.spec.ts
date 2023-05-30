import {
	isSurroundedByDoubleBrackets,
	doubleBracketsInnerReplace,
} from "./utils";

describe("isSurroundedByDoubleBrackets", () => {
	it("should return false when there are no double brackets", () => {
		const result = isSurroundedByDoubleBrackets("[filename]", 4);
		expect(result).toEqual(false);
	});

	it("should return false when the index is not in the double brackets", () => {
		const result = isSurroundedByDoubleBrackets("[[filename]]", 0);
		expect(result).toEqual(false);
	});

	it("should return true if the index is in empty double brackets", () => {
		const result = isSurroundedByDoubleBrackets("[[]]", 2);
		expect(result).toEqual(true);
	});

	it("should return true if the index is in double brackets", () => {
		const result = isSurroundedByDoubleBrackets("[[filename]]", 4);
		expect(result).toEqual(true);
	});
});

describe("doubleBracketsInnerReplace", () => {
	it("should append the replacement if cursor is in empty double brackets", () => {
		const result = doubleBracketsInnerReplace("[[]]", 2, "new");
		expect(result).toEqual("[[new]]");
	});

	it("should replace if cursor is in double brackets", () => {
		const result = doubleBracketsInnerReplace("[[filename]]", 5, "new");
		expect(result).toEqual("[[new]]");
	});

	it("should handle multiple brackets", () => {
		const result = doubleBracketsInnerReplace(
			"[[filename1]] [[filename2]]",
			17,
			"new"
		);
		expect(result).toEqual("[[filename1]] [[new]]");
	});
});
