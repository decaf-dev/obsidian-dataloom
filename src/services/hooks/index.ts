import { randomUUID } from "crypto";
import { MarkdownRenderer } from "obsidian";
import { useState, useEffect, useRef } from "react";
import { NLTView } from "src/NLTView";

export const useId = (): string => {
	const [id] = useState(randomUUID());
	return id;
};

export const useCompare = (value: any) => {
	const prevValue = usePrevious(value);
	return prevValue !== value;
};

const usePrevious = (value: any) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export const useDidMountEffect = (func: (...rest: any) => any, deps: any[]) => {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) func();
		else didMount.current = true;
	}, deps);
};

export const usePosition = () => {
	const containerRef = useRef<any | null>(null);

	let position = {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	};

	if (containerRef.current) {
		const node = containerRef.current as HTMLElement;
		const { top: nodeTop, left: nodeLeft } = node.getBoundingClientRect();
		//We use offsetWidth, and offsetHeight instead of the width and height of the rectangle
		//because we want whole values to match what we set as the column width.
		//This will make sure that the rendered cell and the input cell are the same size
		const { offsetWidth, offsetHeight } = node;
		position = {
			width: offsetWidth,
			height: offsetHeight,
			top: nodeTop,
			left: nodeLeft,
		};
	}

	return { containerRef, position };
};

export const useRenderMarkdown = (
	markdown: string,
	useAutoWidth: boolean,
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
				} catch (e) {
					console.error(e);
				}
				return dom;
			}
			return null;
		}
		renderMarkdown().then((el) => {
			if (el) {
				// const pTag = el.querySelector("p");
				// if (pTag) {
				// 	if (!useAutoWidth && !shouldWrapOverflow) {
				// 		pTag.className = "NLT__hide-overflow";
				// 	}
				// }
				contentRef.current = el;

				if (wrapperRef.current)
					appendOrReplaceFirstChild(wrapperRef.current, el);
			}
		});
	}, [markdown, useAutoWidth, shouldWrapOverflow]);

	return {
		wrapperRef,
		contentRef,
		appendOrReplaceFirstChild,
	};
};
