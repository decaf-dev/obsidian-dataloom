import { CURRENT_FILE_EXTENSION } from "src/data/constants";
import { numToPx } from "src/shared/conversion";

export const getEmbeddedTableLinkEls = (el: HTMLElement) => {
	const embeddedLinkEls = el.querySelectorAll(".internal-embed");
	const tableLinkEls: HTMLElement[] = [];

	for (let i = 0; i < embeddedLinkEls.length; i++) {
		const linkEl = embeddedLinkEls[i];
		const src = linkEl.getAttribute("src");
		if (src?.endsWith(CURRENT_FILE_EXTENSION))
			tableLinkEls.push(linkEl as HTMLElement);
	}
	return tableLinkEls;
};

export const hasLoadedEmbeddedTable = (linkEl: HTMLElement) => {
	if (linkEl.children.length > 0) {
		const firstChildEl = linkEl.children[0];
		if (firstChildEl.classList.contains("DataLoom__embedded-container"))
			return true;
	}
	return false;
};

export const findEmbeddedTableFile = (linkEl: HTMLElement) => {
	const src = linkEl.getAttribute("src");

	const tableFile = app.vault.getFiles().find((file) => file.path === src);
	if (tableFile === undefined)
		return app.vault.getFiles().find((file) => file.name === src) ?? null;
	return tableFile ?? null;
};

export const getEmbeddedTableWidth = (
	linkEl: HTMLElement,
	defaultWidth: string
) => {
	const width = linkEl.getAttribute("width");
	if (width === null || width === "0") return defaultWidth;
	return numToPx(width);
};

export const getEmbeddedTableHeight = (
	linkEl: HTMLElement,
	defaultHeight: string
) => {
	const height = linkEl.getAttribute("height");
	if (height === null || height === "0") return defaultHeight;
	return numToPx(height);
};
