import React from "react";
import { MarkdownRenderer, MarkdownView } from "obsidian";
import { NLTView, NOTION_LIKE_TABLES_VIEW } from "src/obsidian/nlt-view";
import { handleLinkClick } from "./embed";
import { replaceNewLinesWithBr } from "./utils";
import { useMountContext } from "../view-context";

export const useRenderMarkdown = (
	markdown: string,
	shouldWrapOverflow: boolean
) => {
	const { leaf } = useMountContext();
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const markdownRef = React.useRef<HTMLDivElement | null>(null);

	function appendOrReplaceFirstChild(
		container: HTMLDivElement | null,
		child: HTMLDivElement | null
	) {
		if (!container || !child) return;

		//If there is no first child, append the child
		if (container && !container.firstChild) {
			container.appendChild(child);
			//If there is already a child and it is not the same as the child, replace the child
		} else if (container.firstChild && container.firstChild !== child) {
			container.replaceChild(child, container.firstChild);
		}
	}

	React.useEffect(() => {
		async function renderMarkdown() {
			const div = document.body.createDiv();
			div.style.height = "100%";
			div.style.width = "100%";

			//We need to attach this class so that the `is-unresolved` link renders properly by Obsidian
			const view = leaf.view;
			if (view instanceof NLTView) div.classList.add("markdown-rendered");

			//TODO what do this do?
			div.detach();

			try {
				const updated = replaceNewLinesWithBr(markdown);
				const view = leaf.view;
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
						const href = el.getAttr("data-href");
						if (!href) return;

						const destination =
							app.metadataCache.getFirstLinkpathDest(
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
		}

		async function updateContainerRef() {
			const el = await renderMarkdown();
			if (el) {
				//Set the markdown ref equal to the markdown element that we just created
				markdownRef.current = el;

				//If the container ref is not null, append the element to the container
				if (containerRef.current)
					appendOrReplaceFirstChild(containerRef.current, el);
			}
		}

		updateContainerRef();
	}, [markdown, shouldWrapOverflow, leaf]);

	return {
		containerRef,
		markdownRef,
		appendOrReplaceFirstChild,
	};
};
