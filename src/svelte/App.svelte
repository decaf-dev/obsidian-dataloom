<script lang="ts">

interface AppProps {
	mode: 'reading' | 'editing';
}
const { mode}: AppProps = $props();
</script>

{#if mode == 'reading'}
<table>
	<thead>
		<tr>
			<th>
				Header 1
			</th>
			<th>
				Header 2
			</th>
			<th>
				Header 3
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				Cell 1
			</td>
			<td>
				Cell 2
			</td>
			<td>
				Cell 3
			</td>
		</tr>
	</tbody>
</table>
{:else}
<table>
	<thead>
		<tr>
			<th>
				<div class="table-cell-wrapper">
				Header 1
				</div>
			</th>
			<th>
							<div class="table-cell-wrapper">
				Header 2
							</div>
			</th>
			<th>
							<div class="table-cell-wrapper">
				Header 3
				</div>
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
							<div class="table-cell-wrapper">
				Cell 1
				</div>
			</td>
			<td>
							<div class="table-cell-wrapper">
				Cell 2
							</div>
			</td>
			<td>
							<div class="table-cell-wrapper">
				Cell 3
							</div>
			</td>
		</tr>
	</tbody>
</table>
{/if}
