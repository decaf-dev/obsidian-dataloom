<script lang="ts">
	import { ParsedTableData } from "./utils";

interface AppProps {
	data: ParsedTableData;
	mode: 'reading' | 'editing';
}

const { mode, data}: AppProps = $props();
</script>

{#if mode == 'reading'}
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
	</tbody>
</table>
{/if}
