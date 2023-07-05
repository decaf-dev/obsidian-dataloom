import { CURRENT_FILE_EXTENSION } from "src/data/constants";
import { numToPx } from "src/shared/conversion";

export const getEmbeddedDashboardLinkEls = (el: HTMLElement) => {
	const embeddedLinkEls = el.querySelectorAll(".internal-embed");
	const dashboardLinkEls: HTMLElement[] = [];

	for (let i = 0; i < embeddedLinkEls.length; i++) {
		const linkEl = embeddedLinkEls[i];
		const src = linkEl.getAttribute("src");
		if (src?.endsWith(CURRENT_FILE_EXTENSION))
			dashboardLinkEls.push(linkEl as HTMLElement);
	}
	return dashboardLinkEls;
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

	const dashboardFile = app.vault
		.getFiles()
		.find((file) => file.path === src);
	if (dashboardFile === undefined)
		return app.vault.getFiles().find((file) => file.name === src) ?? null;
	return dashboardFile ?? null;
};

export const getEmbeddedDashboardWidth = (
	embeddedLinkEl: HTMLElement,
	defaultWidth: string
) => {
	const width = embeddedLinkEl.getAttribute("width");
	if (width === null || width === "1") return defaultWidth;
	return numToPx(width);
};

export const getEmbeddedDashboardHeight = (
	embeddedLinkEl: HTMLElement,
	defaultHeight: string
) => {
	const height = embeddedLinkEl.getAttribute("height");
	if (height === null || height === "1") return defaultHeight; //exactly 4 normal body rows
	return numToPx(height);
};
