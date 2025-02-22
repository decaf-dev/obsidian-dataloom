<script lang="ts">
	import HolySmokes from "./components/text/index.svelte";
	import { ParsedTableData } from "./utils";

	interface AppProps {
		data: ParsedTableData;
		mode: "reading" | "editing";
	}

	const { mode, data }: AppProps = $props();

	let numColumns = $derived(
		data.head.length > 0 ? data.head.length : data.body[0].length,
	);
</script>

{#if mode == "reading"}
	<table>
		{#if data.head.length > 0}
			<thead>
				<tr>
					{#each data.head as header}
						<th>
							{header}
						</th>
					{/each}
				</tr>
			</thead>
		{/if}
		<tbody>
			{#each data.body as row}
				<tr>
					{#each row as cell}
						<td>
							{cell}
						</td>
					{/each}
				</tr>
			{/each}
			<tr>
				{#each Array.from({ length: numColumns })}
					<HolySmokes value="Calculate" />
				{/each}
			</tr>
		</tbody>
	</table>
{:else}
	<table>
		<thead>
			<tr>
				{#each data.head as header}
					<th>
						<div class="table-cell-wrapper">
							{header}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data.body as row}
				<tr>
					{#each row as cell}
						<td>
							<div class="table-cell-wrapper">
								{cell}
							</div>
						</td>
					{/each}
				</tr>
			{/each}
			<tr>
				{#each Array.from({ length: numColumns })}
					<td
						><div class="table-cell-wrapper">
							<HolySmokes value="Calculate" />
						</div></td
					>
				{/each}
			</tr>
		</tbody>
	</table>
{/if}
