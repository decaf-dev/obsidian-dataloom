<script lang="ts">
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";
	import Text from "../text/text.svelte";

	interface CalculationCellProps {
		mode: "reading" | "editing";
	}

	const { mode }: CalculationCellProps = $props();
</script>

{#if mode === "reading"}
	<td class="dataloom-calculation-cell">
		<MenuRoot>
			<MenuTrigger>
				<Text value="Calculate" variant="faint" />
			</MenuTrigger>
			<MenuContent>Calculate Menu</MenuContent>
		</MenuRoot>
	</td>
{:else}
	<td>
		<div class="table-cell-wrapper dataloom-calculation-cell">
			<MenuRoot>
				<MenuTrigger>
					<Text value="Calculate" variant="faint" />
				</MenuTrigger>
				<MenuContent>Calculate Menu</MenuContent>
			</MenuRoot>
		</div>
	</td>
{/if}

<style>
	.dataloom-calculation-cell {
		padding: 0 !important;
	}
</style>
