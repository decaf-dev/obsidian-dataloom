import { App } from "obsidian";

export const handleLinkClick = (app: App, event: MouseEvent) => {
	const targetEl = event.target as HTMLElement;
	const closestAnchor =
		targetEl.tagName === "A" ? targetEl : targetEl.closest("a");

	if (!closestAnchor) {
		return;
	}

	if (closestAnchor.hasClass("internal-link")) {
		event.preventDefault();

		const href = closestAnchor.getAttr("href");
		const newLeaf = event.ctrlKey || event.metaKey;

		if (href) app.workspace.openLinkText(href, "", newLeaf);
	}
};
