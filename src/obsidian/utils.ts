import { FILE_EXTENSION } from "src/data/constants";
import { numToPx } from "src/shared/conversion";

export const getEmbeddedLoomLinkEls = (el: HTMLElement) => {
	const embeddedLinkEls = el.querySelectorAll(".internal-embed");
	const loomLinkEls: HTMLElement[] = [];

	for (let i = 0; i < embeddedLinkEls.length; i++) {
		const linkEl = embeddedLinkEls[i];
		const src = linkEl.getAttribute("src");
		if (src?.endsWith(FILE_EXTENSION))
			loomLinkEls.push(linkEl as HTMLElement);
	}
	return loomLinkEls;
};

export const hasLoadedEmbeddedLoom = (linkEl: HTMLElement) => {
	if (linkEl.children.length > 0) {
		const firstChildEl = linkEl.children[0];
		if (firstChildEl.classList.contains("DataLoom__embedded-container"))
			return true;
	}
	return false;
};

export const findEmbeddedLoomFile = (linkEl: HTMLElement) => {
	const src = linkEl.getAttribute("src");

	const loomFile = app.vault.getFiles().find((file) => file.path === src);
	if (loomFile === undefined)
		return app.vault.getFiles().find((file) => file.name === src) ?? null;
	return loomFile ?? null;
};

export const getEmbeddedLoomWidth = (
	linkEl: HTMLElement,
	defaultWidth: string
) => {
	const width = linkEl.getAttribute("width");
	if (width === null || width === "0") return defaultWidth;
	return numToPx(width);
};

export const getEmbeddedLoomHeight = (
	linkEl: HTMLElement,
	defaultHeight: string
) => {
	const height = linkEl.getAttribute("height");
	if (height === null || height === "0") return defaultHeight;
	return numToPx(height);
};
