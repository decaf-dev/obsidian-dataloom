import { uppercaseFirst } from ".";

describe("uppercaseFirst", () => {
	it("uppercases first letter", () => {
		const output = uppercaseFirst("test");
		expect(output).toEqual("Test");
	});
});
