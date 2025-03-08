<script lang="ts">
	import type { Snippet } from "svelte";

	interface TableRowProps {
		children: Snippet;
	}

	const { children }: TableRowProps = $props();
</script>

<div class="dataloom-row">
	{@render children()}
</div>

<style>
	.dataloom-row {
		display: table-row;
	}
</style>
