import { getEmbedCellContent } from "./embed-cell-content";

describe("getEmbedCellContent", () => {
	it("should not return markdown when renderMarkdown is false", () => {
		const result = getEmbedCellContent("https://youtube.com", {
			shouldRenderMarkdown: false,
		});
		expect(result).toEqual("https://youtube.com");
	});

	it("should handle external image embeds", () => {
		const result = getEmbedCellContent("https://website.com/test.png", {
			isExternalLink: true,
			shouldRenderMarkdown: true,
		});
		expect(result).toEqual("![](https://website.com/test.png)");
	});

	it("should handle external Twitter embeds", () => {
		const result = getEmbedCellContent("https://youtube.com/watch?v=123", {
			isExternalLink: true,
			shouldRenderMarkdown: true,
		});
		expect(result).toEqual("![](https://youtube.com/watch?v=123)");
	});

	it("should handle external YouTube embeds", () => {
		const result = getEmbedCellContent(
			"https://twitter.com/obsidian/status/123",
			{
				isExternalLink: true,
				shouldRenderMarkdown: true,
			}
		);
		expect(result).toEqual("![](https://twitter.com/obsidian/status/123)");
	});

	it("should display unsupport link when a non-image, non-youtube, or non-twitter link is used", () => {
		const result = getEmbedCellContent("https://google.com", {
			isExternalLink: true,
			shouldRenderMarkdown: true,
		});
		expect(result).toEqual("Unsupported link");
	});

	it("should return a normal embed when export is true", () => {
		const result = getEmbedCellContent("tables/filename.loom", {
			isExport: true,
		});
		expect(result).toEqual("![[tables/filename.loom]]");
	});
});
