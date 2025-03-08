<script lang="ts">
	import type { Snippet } from "svelte";

	interface TableHeaderProps {
		children: Snippet;
	}

	const { children }: TableHeaderProps = $props();
</script>

<div class="dataloom-header">
	{@render children()}
</div>

<style>
	.dataloom-header {
		display: table-header-group;
	}
</style>
