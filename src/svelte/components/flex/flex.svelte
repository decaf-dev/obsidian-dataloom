<script lang="ts">
	import type {
		AlignItems,
		FlexDirection,
		JustifyContent,
	} from "src/shared/render/types";

	import type { Snippet } from "svelte";

	interface FlexProps {
		grow?: boolean;
		flexDir?: FlexDirection;
		justify?: JustifyContent;
		align?: AlignItems;
		wrap?: "wrap" | "nowrap";
		width?: string;
		height?: string;
		children: Snippet;
	}

	const {
		grow = false,
		flexDir = "row",
		justify = "flex-start",
		align = "flex-start",
		wrap = "wrap",
		width,
		height,
		children,
	}: FlexProps = $props();
</script>

<div
	class="dataloom-flex"
	style:flex-grow={grow ? 1 : 0}
	style:flex-direction={flexDir}
	style:justify-content={justify}
	style:align-items={align}
	style:flex-wrap={wrap}
	style:width
	style:height
>
	{@render children()}
</div>

<style>
	.dataloom-flex {
		display: flex;
		width: 100%;
	}
</style>
