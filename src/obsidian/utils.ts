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

export const hasLoadedEmbeddedDashboard = (linkEl: HTMLElement) => {
	if (linkEl.children.length > 0) {
		const firstChildEl = linkEl.children[0];
		if (firstChildEl.classList.contains("Dashboards__embedded-container"))
			return true;
	}
	return false;
};

export const findEmbeddedTableFile = (linkEl: HTMLElement) => {
	const src = linkEl.getAttribute("src");

	const dashboardFile = app.vault
		.getFiles()
		.find((file) => file.path === src);
	if (dashboardFile === undefined)
		return app.vault.getFiles().find((file) => file.name === src) ?? null;
	return dashboardFile ?? null;
};

export const getEmbeddedDashboardWidth = (
	linkEl: HTMLElement,
	defaultWidth: string
) => {
	const width = linkEl.getAttribute("width");
	if (width === null || width === "0") return defaultWidth;
	return numToPx(width);
};

export const getEmbeddedDashboardHeight = (
	linkEl: HTMLElement,
	defaultHeight: string
) => {
	const height = linkEl.getAttribute("height");
	if (height === null || height === "0") return defaultHeight;
	return numToPx(height);
};
