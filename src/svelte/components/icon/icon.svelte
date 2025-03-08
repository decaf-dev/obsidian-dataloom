<script lang="ts">
	import { setIcon } from "obsidian";
	import { appendOrReplaceFirstChild } from "src/shared/render/utils";

	interface IconProps {
		ariaLabel?: string;
		lucideId: string;
		size?: "sm" | "md" | "lg";
		color?: string;
	}

	const { ariaLabel, lucideId, size = "sm", color }: IconProps = $props();

	let ref: HTMLDivElement | undefined = undefined;

	const className = $derived.by(() => {
		if (size === "sm") return "dataloom-svg--sm";
		else if (size === "md") return "dataloom-svg--md";
		else if (size === "lg") return "dataloom-svg--lg";
		return "";
	});

	$effect(() => {
		if (!ref) return;

		const div = document.createElement("div");

		if (color) {
			div.style.color = color;
		}

		setIcon(div, lucideId); //The id should match lucide.dev

		const svg = div.querySelector("svg");
		if (svg) {
			svg.addClass("dataloom-svg");
			svg.addClass(className);
		}

		//Update the reference content
		appendOrReplaceFirstChild(ref, div);
	});
</script>

<div aria-label={ariaLabel} bind:this={ref}></div>

<style global>
	svg.dataloom-svg {
		display: block;
		line-height: 0;
	}

	svg.dataloom-svg--sm {
		width: var(--icon-s);
		height: var(--icon-s);
	}

	svg.dataloom-svg--md {
		width: var(--icon-m);
		height: var(--icon-m);
	}

	svg.dataloom-svg--lg {
		width: var(--icon-l);
		height: var(--icon-l);
	}
</style>
