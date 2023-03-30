import { MarkdownRenderer } from "obsidian";
import { useEffect, useRef } from "react";
import { NLTView } from "src/NLTView";
import "./styles.css";
interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
}

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

export default function TextCell({
	markdown,
	shouldWrapOverflow,
	useAutoWidth,
}: Props) {
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

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
			contentRef.current = el;

			if (wrapperRef.current) {
				appendOrReplaceFirstChild(wrapperRef.current, el);
			}
		});
	}, [markdown]);

	let className = "NLT__text-cell";
	if (useAutoWidth) {
		className += " NLT__auto-width";
	} else {
		if (shouldWrapOverflow) {
			className += " NLT__wrap-overflow";
		} else {
			className += " NLT__hide-overflow";
		}
	}
	return (
		<div
			className={className}
			ref={(node) => {
				wrapperRef.current = node;
				appendOrReplaceFirstChild(node, contentRef.current);
			}}
		>
			{markdown}
		</div>
	);
}
