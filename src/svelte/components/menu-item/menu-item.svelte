<script lang="ts">
	import Flex from "../flex/flex.svelte";
	import Icon from "../icon/icon.svelte";
	import Stack from "../stack/stack.svelte";
	import Text from "../text/text.svelte";

	interface MenuItemProps {
		isSelected?: boolean;
		isFocusable?: boolean;
		isDisabled?: boolean;
		lucideId?: string;
		ariaLabel?: string;
		name: string;
		value?: string;
		onClick?: () => void;
	}

	const {
		isSelected = false,
		isFocusable = true,
		isDisabled = false,
		lucideId,
		ariaLabel,
		name,
		value,
		onClick,
	}: MenuItemProps = $props();

	let className = $derived.by(() => {
		let className = "dataloom-menu-item dataloom-selectable";
		if (isSelected) {
			className += " dataloom-selected";
		} else if (isDisabled) {
			className += " dataloom-disabled";
		}

		if (isFocusable) {
			className += " dataloom-focusable";
		}

		return className;
	});

	function handleClick(event: MouseEvent) {
		if (isDisabled) return;
		if (!onClick) return;

		//Stop propagation so the the menu doesn't remove the focus class
		event.stopPropagation();
		onClick();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (isDisabled) return;

		if (event.key === "Enter") {
			//Stop propagation so the the menu doesn't close when pressing enter
			event.stopPropagation();
			onClick?.();
		}
	}
</script>

<div
	class={className}
	tabindex={0}
	role="button"
	aria-label={ariaLabel}
	onclick={handleClick}
	onkeydown={handleKeyDown}
>
	<Flex justify="space-between" align="center">
		<Stack isHorizontal>
			{#if lucideId !== undefined}
				<Icon {lucideId} />
			{/if}
			<Text value={name} />
		</Stack>
		{#if value !== undefined}
			<Text variant="faint" {value} />
		{/if}
	</Flex>
</div>

<style>
	.dataloom-menu-item {
		display: flex;
		align-items: center;
		padding: var(--dataloom-spacing--sm) var(--dataloom-spacing--lg);
		width: 100%;
	}
</style>
