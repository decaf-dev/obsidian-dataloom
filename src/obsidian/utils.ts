import { TABLE_EXTENSION } from "src/data/constants";
import { numToPx } from "src/shared/conversion";

export const getEmbeddedTableLinkEls = (el: HTMLElement) => {
	const embeddedLinkEls = el.querySelectorAll(".internal-embed");
	const tableLinkEls: HTMLElement[] = [];

	for (let i = 0; i < embeddedLinkEls.length; i++) {
		const linkEl = embeddedLinkEls[i];
		const src = linkEl.getAttribute("src");
		if (src?.endsWith(TABLE_EXTENSION))
			tableLinkEls.push(linkEl as HTMLElement);
	}
	return tableLinkEls;
};

export const removeEmbeddedLinkChildren = (embeddedLinkEl: HTMLElement) => {
	if (embeddedLinkEl.children.length > 0) {
		const firstChildEl = embeddedLinkEl.children[0];
		if (firstChildEl.classList.contains("Dashboards__embedded-container"))
			return;

		//Remove any default children that Obsidian has created
		for (let i = 0; i < embeddedLinkEl.children.length; i++) {
			embeddedLinkEl.removeChild(embeddedLinkEl.children[i]);
		}
	}
};

export const findEmbeddedTableFile = (embeddedLinkEl: HTMLElement) => {
	const src = embeddedLinkEl.getAttribute("src");

	const tableFile = app.vault.getFiles().find((file) => file.path === src);
	if (tableFile === undefined)
		return app.vault.getFiles().find((file) => file.name === src) ?? null;
	return tableFile ?? null;
};

export const getEmbeddedTableWidth = (
	embeddedLinkEl: HTMLElement,
	defaultWidth: string
) => {
	const width = embeddedLinkEl.getAttribute("width");
	if (width === null || width === "1") return defaultWidth;
	return numToPx(width);
};

export const getEmbeddedTableHeight = (
	embeddedLinkEl: HTMLElement,
	defaultHeight: string
) => {
	const height = embeddedLinkEl.getAttribute("height");
	if (height === null || height === "1") return defaultHeight; //exactly 4 normal body rows
	return numToPx(height);
};
