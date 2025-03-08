<script lang="ts">
	import {
		getAriaLabelForCalculation,
		getDisplayNameForCalculation,
	} from "src/shared/loom-state/type-display-names";
	import { GeneralCalculation } from "src/shared/loom-state/types/loom-state";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";
	import MenuItem from "../menu-item/menu-item.svelte";
	import Text from "../text/text.svelte";

	function handleClick(_type: GeneralCalculation) {}
</script>

<MenuRoot>
	<MenuTrigger class="calculation-menu-trigger">
		<Text value="Calculate" variant="faint" />
	</MenuTrigger>
	<MenuContent>
		{#each Object.values(GeneralCalculation) as type}
			<MenuItem
				name={getDisplayNameForCalculation(type)}
				ariaLabel={getAriaLabelForCalculation(type)}
				isSelected={false}
				onClick={() => handleClick(type)}
			/>
		{/each}
	</MenuContent>
</MenuRoot>

<style>
	:global(.calculation-menu-trigger) {
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}
</style>
