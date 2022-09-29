import { uppercaseFirst } from "./regex";

describe("uppercaseFirst", () => {
	it("uppercases first letter", () => {
		const output = uppercaseFirst("test");
		expect(output).toEqual("Test");
	});
});
