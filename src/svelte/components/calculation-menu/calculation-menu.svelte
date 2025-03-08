<script lang="ts">
	import { GeneralCalculation } from "src/shared/loom-state/types/loom-state";
	import { calculationOptions } from "src/svelte/options-data";
	import type { CalculationType } from "src/svelte/types";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";
	import MenuItem from "../menu-item/menu-item.svelte";
	import Stack from "../stack/stack.svelte";
	import Text from "../text/text.svelte";

	interface CalculationMenuProps {
		columnId: string;
		calculationType: CalculationType;
		value?: number;
		onClick: (columnId: string, type: CalculationType) => void;
	}

	const { columnId, calculationType, value, onClick }: CalculationMenuProps =
		$props();
</script>

<MenuRoot>
	<MenuTrigger class="calculation-menu-trigger">
		{#if calculationType === GeneralCalculation.NONE}
			<Text value="Calculate" variant="faint" />
		{:else}
			{@const selectedOption = calculationOptions.find(
				(option) => option.value === calculationType,
			)}
			{#if selectedOption}
				<Stack spacing="sm" isHorizontal>
					<Text value={selectedOption.shortName} variant="muted" />
					<Text value={value ?? ""} variant="semibold" />
				</Stack>
			{/if}
		{/if}
	</MenuTrigger>
	<MenuContent>
		{#each Object.values(GeneralCalculation) as value}
			{@const option = calculationOptions.find(
				(option) => option.value === value,
			)}
			{#if option}
				<MenuItem
					name={option.name}
					ariaLabel={option.ariaLabel}
					isSelected={value === calculationType}
					onClick={() => onClick(columnId, value)}
				/>
			{/if}
		{/each}
	</MenuContent>
</MenuRoot>

<style>
	:global(.calculation-menu-trigger) {
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}
</style>
