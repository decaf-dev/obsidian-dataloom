<script lang="ts">
	import type { Snippet } from "svelte";

	interface TableFooterProps {
		children: Snippet;
	}

	const { children }: TableFooterProps = $props();
</script>

<div class="dataloom-footer">
	{@render children()}
</div>

<style>
	.dataloom-footer {
		display: table-footer-group;
	}
</style>
