import React from "react";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

export const useLeafContainer = () => {
	return document.body;
};

export const isOnMobile = () => {
	return false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useRenderMarkdown = (markdown: string, _isEmbed: boolean) => {
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const renderRef = React.useRef<HTMLElement | null>(null);

	const el = document.createElement("div");
	el.innerHTML = markdown;

	//Set the markdown ref equal to the markdown element that we just created
	renderRef.current = el;

	//If the container ref is not null, append the element to the container
	if (containerRef.current)
		appendOrReplaceFirstChild(containerRef.current, el);

	return {
		containerRef,
		renderRef,
	};
};
