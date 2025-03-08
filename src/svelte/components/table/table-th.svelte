<script lang="ts">
	import type { Snippet } from "svelte";

	interface TableThProps {
		children?: Snippet;
	}

	const { children }: TableThProps = $props();
</script>

<div class="dataloom-th">
	{@render children?.()}
</div>

<style>
	.dataloom-th {
		display: table-cell;
		position: sticky;
		top: 0;
		z-index: 1;
		background-color: var(--background-secondary);
		border-bottom: 1px solid var(--table-border-color);
		border-right: 1px solid var(--table-border-color);

		&:last-of-type {
			border-right: 0;
			background-color: var(--background-primary);
		}
	}
</style>
