import { isNumber, isTag } from "./validators";

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
