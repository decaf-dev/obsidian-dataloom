<script lang="ts">
	import { Component, MarkdownRenderer } from "obsidian";
	import { getObsidianAppContext } from "src/svelte/App.svelte";
	import Input from "../input/input.svelte";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";

	interface BodyContentProps {
		cellId: string;
		value: string;
		onCellInput: (cellId: string, value: string) => void;
	}

	const { cellId, value, onCellInput }: BodyContentProps = $props();

	let valueRef: HTMLElement | undefined = $state(undefined);

	$effect(() => {
		if (!valueRef) return;

		if (value.length !== -1) {
			valueRef.replaceChildren();
			MarkdownRenderer.render(
				obsidianApp,
				value,
				valueRef,
				"",
				new Component(),
			);
		}
	});

	const obsidianApp = getObsidianAppContext();
</script>

<div class="dataloom-body-content">
	<MenuRoot>
		<MenuTrigger class="dataloom-cell-menu-trigger">
			<div class="dataloom-cell-content" bind:this={valueRef}></div>
		</MenuTrigger>
		<MenuContent>
			<div class="dataloom-cell-menu-input-container">
				<Input
					class="dataloom-cell-menu-input"
					placeholder="Enter a value"
					variant="unstyled"
					autoFocus
					{value}
					onInput={(value) => onCellInput(cellId, value)}
				/>
			</div>
		</MenuContent>
	</MenuRoot>
</div>

<style>
	.dataloom-body-content {
		display: flex;
		width: 100%;
		height: 100%;
		min-height: var(--dataloom-cell-min-height);
		width: 140px;
		overflow: hidden;
		text-wrap: nowrap;
	}

	:global(.dataloom-cell-menu-trigger) {
		width: 100%;
		height: 100%;
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);

		&:hover {
			background-color: transparent !important;
		}
	}

	.dataloom-cell-content {
		overflow: hidden;
		:global(p) {
			margin-block: 0;
		}
	}

	.dataloom-cell-menu-input-container {
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}
</style>
