<script lang="ts">
	import { useOverflow } from "src/shared/spacing/hooks";

	interface TextProps {
		variant?:
			| "semibold"
			| "faint"
			| "muted"
			| "on-accent"
			| "error"
			| "normal";
		value: string | number;
		maxWidth?: string;
		shouldWrap?: boolean;
		size?: "xs" | "sm" | "md" | "lg" | "xl";
		whiteSpace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
	}

	const {
		value,
		variant,
		size = "sm",
		maxWidth,
		whiteSpace,
		shouldWrap = false,
	}: TextProps = $props();

	let overflowClassName = $derived(
		useOverflow(shouldWrap || maxWidth !== undefined, {
			ellipsis: true,
		}),
	);

	let className = $derived.by(() => {
		let className = "dataloom-text";
		if (variant === "faint") {
			className += " dataloom-text--faint";
		} else if (variant === "muted") {
			className += " dataloom-text--muted";
		} else if (variant === "semibold") {
			className += " dataloom-text--semibold";
		} else if (variant === "on-accent") {
			className += " dataloom-text--on-accent";
		} else if (variant === "error") {
			className += " dataloom-text--error";
		}
		className += " " + overflowClassName;
		return className;
	});

	let fontSize = $derived.by(() => {
		if (size === "xs") {
			return "--dataloom-font-size--xs";
		} else if (size === "sm") {
			return "--dataloom-font-size--sm";
		} else if (size === "md") {
			return "--dataloom-font-size--md";
		} else if (size === "lg") {
			return "--dataloom-font-size--lg";
		} else if (size === "xl") {
			return "--dataloom-font-size--xl";
		}
	});
</script>

<p
	class={className}
	style:font-size={fontSize ? `var(${fontSize})` : undefined}
	style:max-width={maxWidth}
	style:white-space={whiteSpace}
>
	{value}
</p>

<style>
	.dataloom-text {
		white-space: nowrap;
		margin: 0;
		color: var(--text-normal);
	}

	.dataloom-text--muted {
		color: var(--text-muted);
	}

	.dataloom-text--faint {
		color: var(--text-faint);
	}

	.dataloom-text--semibold {
		font-weight: var(--font-semibold);
	}

	.dataloom-text--on-accent {
		color: var(--text-on-accent);
	}

	.dataloom-text--error {
		color: var(--text-error);
	}
</style>
