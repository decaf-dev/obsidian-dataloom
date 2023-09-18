import { App, MarkdownView } from "obsidian";
import { LOOM_EXTENSION } from "src/data/constants";
import { numToPx } from "src/shared/conversion";

export const getEmbeddedLoomLinkEls = (
	view: MarkdownView,
	mode: "source" | "preview"
) => {
	const linkEls: HTMLElement[] = [];

	const { contentEl } = view;
	const el =
		mode === "source"
			? contentEl.querySelector(".markdown-source-view")
			: contentEl.querySelector(".markdown-reading-view");

	if (el) {
		const embeddedLinkEls = el.querySelectorAll(".internal-embed");
		for (let i = 0; i < embeddedLinkEls.length; i++) {
			const linkEl = embeddedLinkEls[i];
			const src = linkEl.getAttribute("src");
			if (src?.endsWith(LOOM_EXTENSION))
				linkEls.push(linkEl as HTMLElement);
		}
	}
	return linkEls;
};

export const hasLoadedEmbeddedLoom = (linkEl: HTMLElement) => {
	if (linkEl.children.length > 0) {
		const firstChildEl = linkEl.children[0];
		if (firstChildEl.classList.contains("dataloom-embedded-container"))
			return true;
	}
	return false;
};

export const findEmbeddedLoomFile = (
	app: App,
	linkEl: HTMLElement,
	sourcePath: string
) => {
	const src = linkEl.getAttribute("src");
	if (!src) return null;

	//We use the getFirstLinkpathDest to handle absolute links, relative links, and short links
	//in Obsidian.
	return app.metadataCache.getFirstLinkpathDest(src, sourcePath);
};

export const getLinkWidth = (linkEl: HTMLElement, defaultWidth: string) => {
	const width = linkEl.getAttribute("width");
	if (width === null || width === "0") return defaultWidth;
	return numToPx(width);
};

export const getLinkHeight = (linkEl: HTMLElement, defaultHeight: string) => {
	const height = linkEl.getAttribute("height");
	if (height === null || height === "0") return defaultHeight;
	return numToPx(height);
};
