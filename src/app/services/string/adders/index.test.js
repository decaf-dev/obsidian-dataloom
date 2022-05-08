describe("addPound", () => {
	it("adds pounds", () => {
		const output = addPound("test");
		expect(output).toEqual("#test");
	});
});
