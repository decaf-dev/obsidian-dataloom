import { uppercaseFirst } from "./utils";

describe("uppercaseFirst", () => {
	it("uppercases first letter", () => {
		const output = uppercaseFirst("test");
		expect(output).toEqual("Test");
	});
});
