import {
	stripLink,
	stripLinks,
	stripPound,
	stripSquareBrackets,
	sanitizeHTML,
} from "./index";

describe("stripLinks", () => {
	it("strips file link", () => {
		const output = stripLinks(
			'&lt;a href="test" class="internal-link"&gt;test&lt;/a&gt;'
		);
		expect(output).toEqual("[[test]]");
	});

	it("strips file link in text", () => {
		const output = stripLinks(
			'text &lt;a href="test" class="internal-link"&gt;test&lt;/a&gt; text'
		);
		expect(output).toEqual("text [[test]] text");
	});

	it("strips file links in text", () => {
		const output = stripLinks(
			'text &lt;a href="test" class="internal-link"&gt;test&lt;/a&gt; text &lt;a href="test" class="internal-link"&gt;test2&lt;/a&gt;'
		);
		expect(output).toEqual("text [[test]] text [[test2]]");
	});

	it("strips tag links", () => {
		const output = stripLinks(
			'text &lt;a href="test" class="tag"&gt;#test&lt;/a&gt; text &lt;a href="test" class="internal-link"&gt;test2&lt;/a&gt;'
		);
		expect(output).toEqual("text #test text [[test2]]");
	});
});

describe("stripLink", () => {
	it("strips link and replaces with square brackets", () => {
		const output = stripLink(
			'&lt;a class="internal-link"&gt;test&lt;/a&gt;',
			true
		);
		expect(output).toEqual("[[test]]");
	});

	it("strips tag link", () => {
		const output = stripLink(
			'&lt;a href="#Productivity" class="tag" target="_blank" rel="noopener"&gt;#Productivity&lt;/a&gt;'
		);
		expect(output).toEqual("#Productivity");
	});
});

describe("stripPound", () => {
	it("strips pound", () => {
		const output = stripPound("#test");
		expect(output).toEqual("test");
	});
});

describe("stripSquareBrackets", () => {
	it("strips square brackets ", () => {
		const output = stripSquareBrackets("[[test file name]]");
		expect(output).toEqual("test file name");
	});
});

describe("sanitizeHTML", () => {
	it("escapes html characters", () => {
		const html = "<script></script>";
		expect(sanitizeHTML(html)).toEqual("&lt;script&gt;&lt;/script&gt;");
	});
});
