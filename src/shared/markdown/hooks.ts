import React from "react";
import { MarkdownRenderer } from "obsidian";
import { NOTION_LIKE_TABLES_VIEW } from "src/obsidian/nlt-view";
import { handleLinkClick } from "./embed";
import { replaceNewLinesWithBreakTag } from "./utils";
import { useViewContext } from "../view-context";

export const useRenderMarkdown = (
	markdown: string,
	shouldWrapOverflow: boolean
) => {
	const view = useViewContext();
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const contentRef = React.useRef<HTMLDivElement | null>(null);

	function appendOrReplaceFirstChild(
		container: HTMLDivElement | null,
		child: HTMLDivElement | null
	) {
		//If the elements are null return
		if (!child || !container) return;

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
			if (view) {
				const div = document.body.createDiv();
				div.detach();

				try {
					const updated = replaceNewLinesWithBreakTag(markdown);
					await MarkdownRenderer.renderMarkdown(
						updated,
						div,
						view.file.path,
						view
					);

					//TODO fix
					//Handle embeds
					const embeds = div.querySelectorAll(".internal-link");
					embeds.forEach((embed) => {
						const el = embed as HTMLAnchorElement;
						el.onmouseover = (e) => {
							app.workspace.trigger("hover-link", {
								event: e,
								source: NOTION_LIKE_TABLES_VIEW,
								hoverParent: view.containerEl,
								targetEl: el,
								linktext: el.getAttr("data-href"),
								sourcePath: el.href,
							});
						};
						el.onclick = handleLinkClick;
					});
				} catch (e) {
					console.error(e);
				}
				return div;
			}
			return null;
		}

		renderMarkdown().then((el) => {
			if (el) {
				//Set the content ref equal to the markdown element that we just created
				contentRef.current = el;

				//If the container ref is not null, append the element to the container
				if (containerRef.current)
					appendOrReplaceFirstChild(containerRef.current, el);
			}
		});
	}, [markdown, shouldWrapOverflow]);

	return {
		containerRef,
		contentRef,
		appendOrReplaceFirstChild,
	};
};
