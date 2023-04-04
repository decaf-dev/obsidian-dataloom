import { MarkdownRenderer } from "obsidian";
import { useEffect, useRef } from "react";
import { NLTView, NOTION_LIKE_TABLES_VIEW } from "src/NLTView";
import { handleLinkClick } from "./embed";

export const useRenderMarkdown = (
	markdown: string,
	hasAutoWidth: boolean,
	shouldWrapOverflow: boolean
) => {
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	function appendOrReplaceFirstChild(
		wrapper: HTMLDivElement | null,
		child: HTMLDivElement | null
	) {
		if (!child || !wrapper) return;

		if (wrapper && !wrapper.firstChild) {
			wrapper.appendChild(child);
		} else if (wrapper.firstChild && wrapper.firstChild !== child) {
			wrapper.replaceChild(child, wrapper.firstChild);
		}
	}

	useEffect(() => {
		async function renderMarkdown() {
			const view = app.workspace.getActiveViewOfType(NLTView);
			if (view) {
				const dom = document.body.createDiv();
				dom.detach();

				try {
					await MarkdownRenderer.renderMarkdown(
						markdown,
						dom,
						view.file.path,
						view
					);

					//TODO fix
					//Handle embeds
					const embeds = dom.querySelectorAll(".internal-link");
					embeds.forEach((embed) => {
						const el = embed as HTMLAnchorElement;
						el.onmouseover = (e) => {
							app.workspace.trigger("hover-link", {
								event: e,
								source: NOTION_LIKE_TABLES_VIEW,
								hoverParent: view.containerEl,
								targetEl: el,
								linktext: el.innerText,
								sourcePath: el.href,
							});
						};
						el.onclick = handleLinkClick;
					});
				} catch (e) {
					console.error(e);
				}
				return dom;
			}
			return null;
		}
		renderMarkdown().then((el) => {
			if (el) {
				contentRef.current = el;

				if (wrapperRef.current)
					appendOrReplaceFirstChild(wrapperRef.current, el);
			}
		});
	}, [markdown, hasAutoWidth, shouldWrapOverflow]);

	return {
		wrapperRef,
		contentRef,
		appendOrReplaceFirstChild,
	};
};
