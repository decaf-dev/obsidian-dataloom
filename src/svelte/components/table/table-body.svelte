<script lang="ts">
	import type { Snippet } from "svelte";

	interface TableBodyProps {
		children: Snippet;
	}

	const { children }: TableBodyProps = $props();
</script>

<div class="dataloom-body">
	{@render children()}
</div>

<style>
	.dataloom-body {
		display: table-row-group;
	}
</style>
