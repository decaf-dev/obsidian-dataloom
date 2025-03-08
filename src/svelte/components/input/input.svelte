<script lang="ts">
	import clsx from "clsx";
	import { onMount } from "svelte";

	interface InputProps {
		id?: string;
		class?: string;
		variant?: "unstyled" | "default";
		isDisabled?: boolean;
		focusOutline?: "default" | "accent" | "none";
		hasError?: boolean;
		autoFocus?: boolean;
		value: string;
		placeholder?: string;
		isNumeric?: boolean;
		onKeyDown?: (event: KeyboardEvent) => void;
		onInput: (value: string) => void;
		onBlur?: (event: FocusEvent) => void;
	}

	let {
		id,
		class: customClassName,
		variant,
		hasError,
		value,
		isDisabled = false,
		autoFocus = false,
		focusOutline = "accent",
		placeholder,
		isNumeric,
		onInput,
		onKeyDown,
		onBlur,
	}: InputProps = $props();

	let ref: HTMLInputElement | undefined = $state(undefined);

	onMount(() => {
		if (ref && autoFocus) {
			setTimeout(() => {
				ref!.focus();
			}, 1);
		}
	});

	let className = $derived.by(() => {
		let className = "dataloom-input dataloom-focusable";
		if (variant === "unstyled") {
			className += " dataloom-input--unstyled";
		}

		if (isNumeric) className += " dataloom-input--numeric";

		if (focusOutline === "default") {
			className += " dataloom-input__focus-outline--default";
		} else if (focusOutline === "none") {
			className += " dataloom-input__focus-outline--none";
		}

		if (hasError) className += " dataloom-input--error";
		return className;
	});
</script>

<input
	{id}
	bind:this={ref}
	class={clsx(className, customClassName)}
	{placeholder}
	disabled={isDisabled}
	type="text"
	inputMode={isNumeric ? "numeric" : undefined}
	{value}
	oninput={(event) => onInput((event.target as HTMLInputElement).value)}
	onkeydown={onKeyDown}
	onblur={onBlur}
/>

<style>
	.dataloom-input {
		all: unset;
		font-size: var(--text-normal);
		border: var(--input-border-width) solid
			var(--background-modifier-border);
		border-radius: var(--input-radius);
		padding: 4px;
	}

	.dataloom-input--unstyled {
		width: 100%;
		background-color: transparent;
		border: 0;
		border-radius: 0;
		padding: 0;
	}

	.dataloom-input--border {
		border: 1px solid var(--table-border-color) !important;
		background-color: var(--background-secondary) !important;
	}

	.dataloom-input--numeric {
		text-align: right;
	}

	.dataloom-input--error {
		outline: 2px solid var(--background-modifier-error) !important;
		outline-offset: -2px;
	}

	.dataloom-input--error:focus {
		outline: 2px solid var(--background-modifier-error) !important;
	}

	.dataloom-input__focus-outline--default {
		outline: 2px solid var(--background-modifier-border-focus) !important;
		outline-offset: -2px;
	}

	.dataloom-input__focus-outline--none {
		outline: none !important;
	}
</style>
