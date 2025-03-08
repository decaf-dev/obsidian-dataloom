<script lang="ts">
	import type { Snippet } from "svelte";

	interface TableProps {
		children: Snippet;
	}

	const { children }: TableProps = $props();
</script>

<div class="dataloom-table">
	{@render children()}
</div>

<style>
	.dataloom-table {
		display: table;
		table-layout: fixed;
		border-collapse: separate;
	}
</style>
