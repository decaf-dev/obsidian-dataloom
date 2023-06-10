import React from "react";
import { renderEmbedMarkdown, renderMarkdown } from "src/shared/render/embed";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";
import { useMountState } from "./mount-context";
import { Platform } from "obsidian";

export const useLeafContainer = () => {
	const { leaf } = useMountState();
	return leaf.view.containerEl;
};

export const isOnMobile = () => {
	return Platform.isMobile;
};

export const useRenderMarkdown = (markdown: string, isEmbed: boolean) => {
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const renderRef = React.useRef<HTMLElement | null>(null);

	const { leaf } = useMountState();

	React.useEffect(() => {
		async function updateContainerRef() {
			let el = null;
			if (isEmbed) {
				el = await renderEmbedMarkdown(leaf, markdown);
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
	}, [markdown, leaf, isEmbed]);

	return {
		containerRef,
		renderRef,
	};
};
