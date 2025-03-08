<script lang="ts">
	import clsx from "clsx";
	import type { Snippet } from "svelte";

	interface BodyContentProps {
		children: Snippet;
	}

	const { children }: BodyContentProps = $props();
</script>

<div class={clsx("dataloom-body-content")}>
	{@render children()}
</div>

<style>
	.dataloom-body-content {
		display: flex;
		width: 100%;
		height: 100%;
		min-height: var(--dataloom-cell-min-height);
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}
</style>
