<script lang="ts">
	import {
		getAriaLabelForCalculation,
		getDisplayNameForCalculation,
	} from "src/shared/loom-state/type-display-names";
	import { GeneralCalculation } from "src/shared/loom-state/types/loom-state";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";
	import MenuItem from "../menu-item/menu-item.svelte";
	import Text from "../text/text.svelte";

	function handleClick(type: GeneralCalculation) {
		console.log(type);
	}
</script>

<MenuRoot>
	<MenuTrigger class="dataloom-cell-padding">
		<Text value="Calculate" variant="faint" />
	</MenuTrigger>
	<MenuContent>
		{#each Object.values(GeneralCalculation) as type}
			<MenuItem
				name={getDisplayNameForCalculation(type)}
				ariaLabel={getAriaLabelForCalculation(type)}
				isSelected={true}
				onClick={() => handleClick(type)}
			/>
		{/each}
	</MenuContent>
</MenuRoot>
