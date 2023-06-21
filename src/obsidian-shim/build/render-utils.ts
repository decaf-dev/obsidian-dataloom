import React from "react";

import {
	appendOrReplaceFirstChild,
	replaceNewLinesWithBr,
} from "src/shared/render/utils";
import { useMountState } from "./mount-context";
import {
	MarkdownRenderer,
	MarkdownView,
	Platform,
	WorkspaceLeaf,
} from "obsidian";
import { NLTView, NOTION_LIKE_TABLES_VIEW } from "src/obsidian/nlt-view";
import { handleLinkClick } from "src/shared/render/embed";
import { renderEmbed } from "./render-embed";

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

export const useRenderMarkdown = (
	markdown: string,
	options: {
		isExternalLink?: boolean;
		isEmbed?: boolean;
	}
) => {
	const { isEmbed = false, isExternalLink = false } = options ?? {};
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const renderRef = React.useRef<HTMLElement | null>(null);

	const { leaf } = useMountState();

	React.useEffect(() => {
		async function updateContainerRef() {
			let el = null;
			if (isEmbed) {
				el = await renderEmbed(leaf, markdown);
			} else {
				el = await renderMarkdown(leaf, markdown);
			}

			if (el) {
				//Set the markdown ref equal to the markdown element that we just created
				renderRef.current = el;

				//If the container ref is not null, append the element to the container
				if (containerRef.current)
					appendOrReplaceFirstChild(containerRef.current, el);
			}
		}

		updateContainerRef();
	}, [markdown, leaf, isExternalLink]);

	return {
		containerRef,
		renderRef,
	};
};

export const useLeafContainer = () => {
	const { leaf } = useMountState();
	return leaf.view.containerEl;
};

export const isOnMobile = () => {
	return Platform.isMobile;
};
