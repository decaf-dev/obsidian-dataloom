<script lang="ts">
	import clsx from "clsx";
	import type { Snippet } from "svelte";

	interface TableThProps {
		variant?: "default" | "add-column";
		children?: Snippet;
	}

	const { variant = "default", children }: TableThProps = $props();
</script>

<div
	class={clsx("dataloom-th", {
		"dataloom-th--add-column": variant === "add-column",
	})}
>
	{@render children?.()}
</div>

<style>
	.dataloom-th {
		display: table-cell;
		position: sticky;
		top: 0;
		height: 40px;
		vertical-align: middle;
		z-index: 1;
		background-color: var(--background-secondary);
		border-bottom: 1px solid var(--table-border-color);
		border-right: 1px solid var(--table-border-color);

		&:last-of-type {
			border-right: 0;
			background-color: var(--background-primary);
		}
	}

	.dataloom-th--add-column {
		padding: 4px;
	}
</style>
