import {
	parseURLs,
	parseFileLinks,
	parseBoldTags,
	parseItalicTags,
	parseHighlightTags,
	parseUnderlineTags,
	parseBoldMarkdown,
	parseItalicMarkdown,
	parseHighlightMarkdown,
} from "./";

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
});

describe("parseBoldTags", () => {
	it("parses strong tag", () => {
		const parsed = parseBoldTags("&lt;strong&gt;test&lt;/strong&gt;");
		expect(parsed).toEqual("**test**");
	});

	it("parses b tag", () => {
		const parsed = parseBoldTags("&lt;b&gt;test&lt;/b&gt;");
		expect(parsed).toEqual("<b>test</b>");
	});

	it("parses multiple tags", () => {
		const parsed = parseBoldTags(
			"&lt;strong&gt;test&lt;/strong&gt; &lt;strong&gt;test&lt;/strong&gt;"
		);
		expect(parsed).toEqual("**test** **test**");
	});
	it("parses tag with no space", () => {
		const parsed = parseBoldTags(
			"&lt;strong&gt;test&lt;/strong&gt;&lt;strong&gt;test&lt;/strong&gt;"
		);
		expect(parsed).toEqual("**test****test**");
	});

	it("doesn't parse when the tag is broken", () => {
		const parsed = parseBoldTags("&lt;strong&gt;test");
		expect(parsed).toEqual("&lt;strong&gt;test");
	});
});

describe("parseItalicTags", () => {
	it("parses em tag", () => {
		const parsed = parseItalicTags("&lt;em&gt;test&lt;/em&gt;");
		expect(parsed).toEqual("*test*");
	});

	it("parses i tag", () => {
		const parsed = parseItalicTags("&lt;i&gt;test&lt;/i&gt;");
		expect(parsed).toEqual("<i>test</i>");
	});

	it("parses multiple tags", () => {
		const parsed = parseItalicTags(
			"&lt;em&gt;test&lt;/em&gt; &lt;em&gt;test&lt;/em&gt;"
		);
		expect(parsed).toEqual("*test* *test*");
	});
	it("parses tag with no space", () => {
		const parsed = parseItalicTags(
			"&lt;em&gt;test&lt;/em&gt;&lt;em&gt;test&lt;/em&gt;"
		);
		expect(parsed).toEqual("*test**test*");
	});

	it("doesn't parse when the tag is broken", () => {
		const parsed = parseItalicTags("&lt;em&gt;test");
		expect(parsed).toEqual("&lt;em&gt;test");
	});
});

describe("parseHighlightTags", () => {
	it("parses tag", () => {
		const parsed = parseHighlightTags("&lt;mark&gt;test&lt;/mark&gt;");
		expect(parsed).toEqual("==test==");
	});

	it("parses multiple tags", () => {
		const parsed = parseHighlightTags(
			"&lt;mark&gt;test&lt;/mark&gt; &lt;mark&gt;test&lt;/mark&gt;"
		);
		expect(parsed).toEqual("==test== ==test==");
	});
	it("parses tag with no space", () => {
		const parsed = parseHighlightTags(
			"&lt;mark&gt;test&lt;/mark&gt;&lt;mark&gt;test&lt;/mark&gt;"
		);
		expect(parsed).toEqual("==test====test==");
	});

	it("doesn't parse when the tag is broken", () => {
		const parsed = parseHighlightTags("&lt;mark&gt;test");
		expect(parsed).toEqual("&lt;mark&gt;test");
	});
});

describe("parseUnderlineTags", () => {
	it("parses tags", () => {
		const parsed = parseUnderlineTags("&lt;u&gt;test&lt;/u&gt;");
		expect(parsed).toEqual("<u>test</u>");
	});

	it("parses multiple tags", () => {
		const parsed = parseUnderlineTags(
			"&lt;u&gt;test&lt;/u&gt; &lt;u&gt;test&lt;/u&gt;"
		);
		expect(parsed).toEqual("<u>test</u> <u>test</u>");
	});
	it("parses tag with no space", () => {
		const parsed = parseUnderlineTags(
			"&lt;u&gt;test&lt;/u&gt;&lt;u&gt;test&lt;/u&gt;"
		);
		expect(parsed).toEqual("<u>test</u><u>test</u>");
	});

	it("doesn't parse when the tag is broken", () => {
		const parsed = parseUnderlineTags("&lt;u&gt;test");
		expect(parsed).toEqual("&lt;u&gt;test");
	});
});

describe("parseBoldMarkdown", () => {
	it("parses markdown", () => {
		const parsed = parseBoldMarkdown("**test**");
		expect(parsed).toEqual("<b>test</b>");
	});

	it("parses multiple elements", () => {
		const parsed = parseBoldMarkdown("**test** **test**");
		expect(parsed).toEqual("<b>test</b> <b>test</b>");
	});

	it("parses markdown with no space", () => {
		const parsed = parseBoldMarkdown("**test****test**");
		expect(parsed).toEqual("<b>test</b><b>test</b>");
	});
});

describe("parseItalicMarkdown", () => {
	it("parses markdown", () => {
		const parsed = parseItalicMarkdown("*test*");
		expect(parsed).toEqual("<i>test</i>");
	});

	it("parses multiple elements", () => {
		const parsed = parseItalicMarkdown("*test* *test*");
		expect(parsed).toEqual("<i>test</i> <i>test</i>");
	});

	it("parses markdown with no space", () => {
		const parsed = parseItalicMarkdown("*test**test*");
		expect(parsed).toEqual("<i>test</i><i>test</i>");
	});
});

describe("parseHighlightMarkdown", () => {
	it("parses markdown", () => {
		const parsed = parseHighlightMarkdown("==test==");
		expect(parsed).toEqual("<mark>test</mark>");
	});

	it("parses multiple elements", () => {
		const parsed = parseHighlightMarkdown("==test== ==test==");
		expect(parsed).toEqual("<mark>test</mark> <mark>test</mark>");
	});

	it("parses markdown with no space", () => {
		const parsed = parseHighlightMarkdown("==test====test==");
		expect(parsed).toEqual("<mark>test</mark><mark>test</mark>");
	});
});
