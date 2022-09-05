import { isNumber, isTag } from ".";

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

describe("countNumTags", () => {
	it("counts single letter tag", () => {
		const numTags = countNumTags("#t");
		expect(numTags).toEqual(1);
	});

	it("counts single tag", () => {
		const numTags = countNumTags("#test");
		expect(numTags).toEqual(1);
	});

	it("counts many tags", () => {
		const numTags = countNumTags("#one #two #three");
		expect(numTags).toEqual(3);
	});

	it("counts tags with numbers", () => {
		const numTags = countNumTags("#123 #567");
		expect(numTags).toEqual(2);
	});

	it("counts tags with uppercase", () => {
		const numTags = countNumTags("#TEST");
		expect(numTags).toEqual(1);
	});

	it("counts tags with underscore", () => {
		const numTags = countNumTags("#test_test2");
		expect(numTags).toEqual(1);
	});

	it("counts tags with hyphen", () => {
		const numTags = countNumTags("#test-test2");
		expect(numTags).toEqual(1);
	});

	it("counts tag in middle of test", () => {
		const numTags = countNumTags("test #test test");
		expect(numTags).toEqual(1);
	});
});
