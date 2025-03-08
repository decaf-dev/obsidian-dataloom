<script lang="ts">
	import clsx from "clsx";
	import type { Snippet } from "svelte";

	interface TableTdProps {
		isFooter?: boolean;
		children?: Snippet;
	}

	const { isFooter = false, children }: TableTdProps = $props();
</script>

<div class={clsx("dataloom-td", { "dataloom-td--footer": isFooter })}>
	{@render children?.()}
</div>

<!-- <style>
	.dataloom-cell--left-corner {
		width: 35px;
	}

	.dataloom-cell.dataloom-cell--freeze {
		position: sticky;
		left: 0;
		z-index: 2;
		background-color: var(--background-primary);
	}

	.dataloom-cell.dataloom-cell--freeze-header {
		background-color: var(--background-secondary);
		z-index: 3;
	}

	.dataloom-cell.dataloom-cell--freeze-footer {
		z-index: 3;
	}
</style> -->

<style>
	:global(.dataloom-cell-padding) {
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}

	:global(.dataloom-body > .dataloom-row:last-child > .dataloom-td) {
		border-bottom: 0;
	}

	.dataloom-td {
		display: table-cell;
		border-bottom: 1px solid var(--table-border-color);
		border-right: 1px solid var(--table-border-color);
		vertical-align: top;

		/** This is hack to make the children to have something to calculate their height percentage from. */
		height: 1px;

		&:last-of-type {
			border-right: 0;
		}
	}

	.dataloom-td--footer {
		position: sticky;
		bottom: 0;
		z-index: 1;
		background-color: var(--background-primary);
		border-top: 1px solid var(--table-border-color);
		border-right: 0;
	}
</style>
