import { toExternalLink, toTagLink, toFileLink } from "./";

describe("toExternalLink", () => {
	it("creates a external link", () => {
		const link = toExternalLink("https://test.com");
		expect(link).toEqual(
			'<a tabIndex={-1} href="https://test.com" target="_blank" rel="noopener">https://test.com</a>'
		);
	});
});

describe("toFileLink", () => {
	it("creates an internal file link", () => {
		const link = toFileLink("test");
		expect(link).toEqual(
			'<a tabIndex={-1} data-href="test" href="test" class="internal-link" target="_blank" rel="noopener">test</a>'
		);
	});
});

describe("toTagLink", () => {
	it("creates an internal tag link", () => {
		const link = toTagLink("test");
		expect(link).toEqual(
			'<a tabIndex={-1} href="#test" class="tag" target="_blank" rel="noopener">#test</a>'
		);
	});

	it("throws error when tag name starts with pound", () => {
		expect(() => {
			toTagLink("#test");
		}).toThrow("tagName cannot start with pound symbol");
	});
});
