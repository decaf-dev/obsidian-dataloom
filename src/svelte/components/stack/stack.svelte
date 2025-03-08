<script lang="ts">
	import clsx from "clsx";
	import type { AlignItems, JustifyContent } from "src/shared/render/types";
	import { getSpacing } from "src/shared/spacing";
	import type { SpacingSize } from "src/shared/spacing/types";
	import type { Snippet } from "svelte";

	interface StackProps {
		class?: string;
		spacing?: SpacingSize;
		justify?: JustifyContent;
		align?: AlignItems;
		isHorizontal?: boolean;
		grow?: boolean;
		width?: string;
		height?: string;
		minHeight?: string;
		overflow?: "auto" | "hidden" | "scroll" | "visible";
		children: Snippet;
	}

	const {
		class: className,
		spacing = "md",
		justify,
		align,
		grow,
		overflow,
		children,
		width,
		height,
		minHeight,
		isHorizontal = false,
	}: StackProps = $props();

	let justifyContent = $derived.by(() => {
		let justifyContent = justify;

		if (justifyContent === undefined) {
			if (!isHorizontal) justifyContent = "center";
			else justifyContent = "flex-start";
		}

		return justifyContent;
	});

	let alignItems = $derived.by(() => {
		let alignItems = align;

		if (alignItems === undefined) {
			if (isHorizontal) alignItems = "center";
			else alignItems = "flex-start";
		}

		return alignItems;
	});
</script>

<div
	class={clsx("dataloom-stack", className)}
	style:flex-direction={isHorizontal ? "row" : "column"}
	style:flex-grow={grow ? 1 : 0}
	style:justify-content={justifyContent}
	style:align-items={alignItems}
	style:column-gap={isHorizontal ? getSpacing(spacing) : undefined}
	style:row-gap={!isHorizontal ? getSpacing(spacing) : undefined}
	style:width
	style:height
	style:min-height={minHeight}
	style:overflow
>
	{@render children()}
</div>

<style>
	.dataloom-stack {
		display: flex;
	}
</style>
