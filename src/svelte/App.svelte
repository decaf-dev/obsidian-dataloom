<script lang="ts">
	import Table from "./components/table/table.svelte";
	import type { ParsedTableData } from "./utils";

	interface AppProps {
		data: ParsedTableData;
		mode: "reading" | "editing";
	}

	const { mode, data }: AppProps = $props();
</script>

<Table {mode} {data} />
