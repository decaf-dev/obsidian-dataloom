<script lang="ts">
	import type { Snippet } from "svelte";
	import Stack from "../stack/stack.svelte";

	import Logger from "js-logger";
	import Icon from "../icon/icon.svelte";

	type ButtonVariant = "default" | "link" | "text";
	type ButtonSize = "sm" | "md" | "lg";

	interface ButtonProps {
		isDisabled?: boolean;
		variant?: ButtonVariant;
		size?: ButtonSize;
		isFullWidth?: boolean;
		isFocusable?: boolean;
		invertFocusColor?: boolean;
		ariaLabel?: string;
		lucideId?: string;
		children?: Snippet;
		onClick?: () => void;
		onMouseDown?: (event: MouseEvent) => void;
	}

	const {
		isDisabled = false,
		variant = "text",
		isFullWidth,
		isFocusable = true,
		size = "md",
		invertFocusColor,
		children,
		ariaLabel = "",
		lucideId,
		onClick,
		onMouseDown,
	}: ButtonProps = $props();

	let className = $derived.by(() => {
		let className = "dataloom-button";

		if (isFocusable) {
			className += " dataloom-focusable";
			if (invertFocusColor) className += " dataloom-focusable--inverted";
		}

		if (variant == "link") className += " dataloom-button--link";
		else if (variant == "text") className += " dataloom-button--text";

		if (size == "sm") className += " dataloom-button--sm";
		else if (size == "md") className += " dataloom-button--md";
		else if (size == "lg") className += " dataloom-button--lg";

		if (isFullWidth) className += " dataloom-button--full-width";
		return className;
	});

	function handleKeyDown(event: KeyboardEvent) {
		Logger.trace("Button handleKeyDown");
		if (event.key === "Enter") {
			//Stop click event
			event.preventDefault();

			//Stop propagation so the the menu doesn't close when pressing enter
			event.stopPropagation();

			onClick?.();
		}
	}
</script>

<div
	role="button"
	tabindex={isFocusable ? 0 : -1}
	class={className}
	aria-label={ariaLabel}
	onkeydown={handleKeyDown}
	onmousedown={onMouseDown}
	onclick={isDisabled ? undefined : onClick}
>
	<Stack isHorizontal>
		{#if lucideId}
			<Icon {lucideId} />
		{/if}
		{@render children?.()}
	</Stack>
</div>

<style>
	.dataloom-button {
		white-space: nowrap;
		color: var(--text-normal);
		font-size: var(--font-size-normal);
		border-radius: var(--button-radius);
		cursor: pointer;
		background-color: var(--background-modifier-hover);
	}

	.dataloom-button:focus-visible {
		box-shadow: none;
	}

	.dataloom-button--link {
		color: var(--link-color);
		text-decoration-line: var(--link-decoration);
		cursor: var(--cursor-link);
		background-color: transparent;
		box-shadow: none;
		border: none;
	}

	.dataloom-button--link:hover {
		box-shadow: var(--input-shadow);
	}

	.dataloom-button--sm {
		padding: 2px;
	}

	.dataloom-button--md {
		padding: 6px;
	}

	.dataloom-button--lg {
		padding: 10px;
	}

	.dataloom-button--full-width {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		border-radius: 0px;
	}

	.dataloom-button--text {
		background-color: transparent;
	}

	.dataloom-button--text:hover {
		background-color: var(--background-modifier-hover);
	}

	.dataloom-button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
