describe("parseURLs", () => {
	it("parses a url", () => {
		const parsed = parseURLs("https://test.com");
		expect(parsed).toEqual(
			'<a tabIndex={-1} href="https://test.com" target="_blank" rel="noopener">https://test.com</a>'
		);
	});

	it("parses multiple urls", () => {
		const parsed = parseURLs("https://test.com https://test2.com");
		expect(parsed).toEqual(
			'<a tabIndex={-1} href="https://test.com" target="_blank" rel="noopener">https://test.com</a> <a tabIndex={-1} href="https://test2.com" target="_blank" rel="noopener">https://test2.com</a>'
		);
	});

	//TODO parses same link
});

describe("parseFileLinks", () => {
	it("parses a file link", () => {
		const parsed = parseFileLinks("[[test]]");
		expect(parsed).toEqual(
			'<a tabIndex={-1} data-href="test" href="test" class="internal-link" target="_blank" rel="noopener">test</a>'
		);
	});

	it("parses multiple file links", () => {
		const parsed = parseFileLinks("[[test]] [[test2]]");
		expect(parsed).toEqual(
			'<a tabIndex={-1} data-href="test" href="test" class="internal-link" target="_blank" rel="noopener">test</a> <a tabIndex={-1} data-href="test2" href="test2" class="internal-link" target="_blank" rel="noopener">test2</a>'
		);
	});

	it("parses file links with spaces", () => {
		const parsed = parseFileLinks("[[this is my file]]");
		expect(parsed).toEqual(
			'<a tabIndex={-1} data-href="this is my file" href="this is my file" class="internal-link" target="_blank" rel="noopener">this is my file</a>'
		);
	});

	//TODO parses same link
});
