<script lang="ts">
	import clsx from "clsx";
	import { getSpacing } from "src/shared/spacing";
	import type { SpacingSize } from "src/shared/spacing/types";
	import type { Snippet } from "svelte";

	interface PaddingProps {
		class?: string;
		px?: SpacingSize;
		py?: SpacingSize;
		pl?: SpacingSize;
		pr?: SpacingSize;
		pt?: SpacingSize;
		pb?: SpacingSize;
		p?: SpacingSize;
		width?: string;
		children: Snippet;
	}

	const {
		class: className,
		width = "100%",
		px,
		py,
		pt,
		pb,
		pl,
		pr,
		p,
		children,
	}: PaddingProps = $props();

	const { renderPt, renderPb, renderPl, renderPr } = $derived.by(() => {
		let renderPt = "";
		let renderPb = "";
		let renderPl = "";
		let renderPr = "";

		if (p) {
			renderPt = getSpacing(p);
			renderPb = getSpacing(p);
			renderPl = getSpacing(p);
			renderPr = getSpacing(p);
		}

		if (px) {
			const spacing = getSpacing(px);
			renderPl = spacing;
			renderPr = spacing;
		} else if (pl || pr) {
			if (pl) {
				renderPl = getSpacing(pl);
			}
			if (pr) {
				renderPr = getSpacing(pr);
			}
		}

		if (py) {
			const spacing = getSpacing(py);
			renderPt = spacing;
			renderPb = spacing;
		} else if (pt || pb) {
			if (pt) {
				renderPt = getSpacing(pt);
			}
			if (pb) {
				renderPb = getSpacing(pb);
			}
		}

		return { renderPt, renderPb, renderPl, renderPr };
	});
</script>

<div
	class={clsx("dataloom-padding", className)}
	style:width
	style:padding-top={renderPt}
	style:padding-bottom={renderPb}
	style:padding-left={renderPl}
	style:padding-right={renderPr}
>
	{@render children()}
</div>
