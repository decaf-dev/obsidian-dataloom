import { isNumber } from "./validators";

describe("isNumber", () => {
	it("returns true if number", () => {
		const value = isNumber("123456");
		expect(value).toEqual(true);
	});

	it("returns false if a number with a space", () => {
		const value = isNumber("123 567");
		expect(value).toEqual(false);
	});

	it("returns false if contains test", () => {
		const value = isNumber("ABC123");
		expect(value).toEqual(false);
	});
});
