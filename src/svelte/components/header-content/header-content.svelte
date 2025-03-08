<script lang="ts">
	import clsx from "clsx";
	import type { Snippet } from "svelte";

	interface HeaderContentProps {
		children: Snippet;
	}

	const { children }: HeaderContentProps = $props();
</script>

<div class={clsx("dataloom-header-content")}>
	{@render children()}
</div>

<style>
	.dataloom-header-content {
		display: flex;
		align-items: center;
		/* Use 100% so that the resize indicator appears at the end */
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		user-select: none;
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}
</style>
