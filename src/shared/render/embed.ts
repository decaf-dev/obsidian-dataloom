import { MarkdownRenderer, MarkdownView, WorkspaceLeaf } from "obsidian";
import { NLTView, NOTION_LIKE_TABLES_VIEW } from "src/obsidian/nlt-view";
import { replaceNewLinesWithBr } from "./utils";

export const handleLinkClick = (event: MouseEvent) => {
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

export const renderEmbedMarkdown = async (
	leaf: WorkspaceLeaf,
	markdown: string
) => {
	try {
		const view = leaf.view;

		if (view instanceof MarkdownView || view instanceof NLTView) {
			const div = document.body.createDiv();
			div.style.height = "100%";
			div.style.width = "100%";

			console.log(markdown);

			await MarkdownRenderer.renderMarkdown(
				markdown,
				div,
				view.file.path,
				view
			);

			return div;
		}
	} catch (e) {
		console.error(e);
	}
	return null;
};

export const renderMarkdown = async (leaf: WorkspaceLeaf, markdown: string) => {
	const div = document.createElement("div");
	div.style.height = "100%";
	div.style.width = "100%";

	//We need to attach this class so that the `is-unresolved` link renders properly by Obsidian
	const view = leaf?.view;
	if (view instanceof NLTView) div.classList.add("markdown-rendered");

	try {
		const updated = replaceNewLinesWithBr(markdown);
		const view = leaf?.view;

		if (view instanceof MarkdownView || view instanceof NLTView) {
			await MarkdownRenderer.renderMarkdown(
				updated,
				div,
				view.file.path,
				view
			);

			const embeds = div.querySelectorAll(".internal-link");
			embeds.forEach((embed) => {
				const el = embed as HTMLAnchorElement;
				const href = el.getAttribute("data-href");
				if (!href) return;

				const destination = app.metadataCache.getFirstLinkpathDest(
					href,
					view.file.path
				);
				if (!destination) embed.classList.add("is-unresolved");

				el.addEventListener("mouseover", (e) => {
					e.stopPropagation();
					app.workspace.trigger("hover-link", {
						event: e,
						source: NOTION_LIKE_TABLES_VIEW,
						hoverParent: view.containerEl,
						targetEl: el,
						linktext: href,
						sourcePath: el.href,
					});
				});

				el.addEventListener("click", handleLinkClick);
			});
		}
	} catch (e) {
		console.error(e);
	}
	return div;
};
