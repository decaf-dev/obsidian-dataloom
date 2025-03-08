<script lang="ts">
	import clsx from "clsx";
	import type { Snippet } from "svelte";

	interface BodyContentProps {
		children: Snippet;
	}

	const { children }: BodyContentProps = $props();
</script>

<div class={clsx("dataloom-body-content", "dataloom-cell-padding")}>
	{@render children()}
</div>

<style>
	.dataloom-body-content {
		display: flex;
		width: 100%;
		height: 100%;
		min-height: var(--dataloom-cell-min-height);
		cursor: pointer;
		color: var(
			--text-normal
		); /* Stop dimming of text when mouse leaves embedded loom */
	}
</style>
