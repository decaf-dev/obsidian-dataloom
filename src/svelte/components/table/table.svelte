<script lang="ts">
	import type { ParsedTableData } from "../../utils";
	import CalculationCell from "./calculation-cell.svelte";

	interface TableProps {
		mode: "reading" | "editing";
		data: ParsedTableData;
	}

	const { mode, data }: TableProps = $props();

	let numColumns = $derived(
		data.head.length > 0 ? data.head.length : data.body[0].length,
	);
</script>

{#if mode === "reading"}
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
						<td class="dataloom-cell">
							{cell}
						</td>
					{/each}
				</tr>
			{/each}
			<tr>
				{#each Array.from({ length: numColumns })}
					<CalculationCell {mode} />
				{/each}
			</tr>
		</tbody>
	</table>
{:else}
	<table>
		{#if data.head.length > 0}
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
		{/if}
		<tbody>
			{#each data.body as row}
				<tr>
					{#each row as cell}
						<td class="dataloom-cell">
							<div class="table-cell-wrapper">
								{cell}
							</div>
						</td>
					{/each}
				</tr>
			{/each}
			<tr>
				{#each Array.from({ length: numColumns })}
					<CalculationCell {mode} />
				{/each}
			</tr>
		</tbody>
	</table>
{/if}

<!-- <style>
	.dataloom-table {
		display: table;
		table-layout: fixed;
		border-collapse: separate;
	}

	.dataloom-header {
		display: table-header-group;
	}

	.dataloom-body {
		display: table-row-group;
	}

	.dataloom-footer {
		display: table-footer-group;
	}

	.dataloom-row {
		display: table-row;
	}

	.dataloom-cell {
		display: table-cell;
	}

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

	.dataloom-cell--header {
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

	.dataloom-cell--body {
		border-bottom: 1px solid var(--table-border-color);
		border-right: 1px solid var(--table-border-color);
		vertical-align: top;

		/** This is hack to make the children to have something to calculate their height percentage from. */
		height: 1px;

		&:last-of-type {
			border-right: 0;
		}
	}

	.dataloom-cell--footer {
		position: sticky;
		bottom: 0;
		z-index: 1;
		background-color: var(--background-primary);
		border-top: 1px solid var(--table-border-color);
	}

	.dataloom-body > .dataloom-row:last-child > .dataloom-cell {
		border-bottom: 0;
	}
</style> -->

<style>
</style>
