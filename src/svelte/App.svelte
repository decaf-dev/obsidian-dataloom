<script lang="ts">
	import AddRowButton from "./components/add-row-button/add-row-button.svelte";
	import BodyContent from "./components/body-content/body-content.svelte";
	import CalculationMenu from "./components/calculation-menu/calculation-menu.svelte";
	import HeaderContent from "./components/header-content/header-content.svelte";
	import MenuStore from "./components/menu/menu-store";
	import RowMenu from "./components/row-menu/row-menu.svelte";
	import {
		TableFooter,
		TableRoot,
		TableTd,
		TableTh,
	} from "./components/table";
	import TableBody from "./components/table/table-body.svelte";
	import TableHeader from "./components/table/table-header.svelte";
	import TableRow from "./components/table/table-row.svelte";
	import type { ParsedTableData } from "./utils";

	interface AppProps {
		data: ParsedTableData;
		mode: "reading" | "editing";
	}

	const { data }: AppProps = $props();

	let numColumns = $derived(
		data.head.length > 0 ? data.head.length : data.body[0].length,
	);

	const menuStore = MenuStore.getInstance();
	const openMenus = menuStore.openMenus;

	function handleClick(event: MouseEvent) {
		const topMenu = menuStore.getTopMenu();
		if (!topMenu) return;

		const target = event.target as HTMLElement;
		const isClickInsideMenu =
			target.closest(`[data-id="${topMenu.id}"]`) !== null;

		if (!isClickInsideMenu) {
			menuStore.closeTop();
		}
	}

	$effect(() => {
		if ($openMenus.length > 0) {
			document.addEventListener("click", handleClick);
		}
		return () => {
			document.removeEventListener("click", handleClick);
		};
	});
</script>

<TableRoot>
	{#if data.head.length > 0}
		<TableHeader>
			<TableRow>
				<TableTh />
				{#each data.head as header}
					<TableTh>
						<HeaderContent>
							{header}
						</HeaderContent>
					</TableTh>
				{/each}
				<TableTh variant="add-row-button">
					<AddRowButton />
				</TableTh>
			</TableRow>
		</TableHeader>
	{/if}
	<TableBody>
		{#each data.body as row}
			<TableRow>
				<TableTd variant="row-menu">
					<RowMenu />
				</TableTd>
				{#each row as cell}
					<TableTd>
						<BodyContent>
							{cell}
						</BodyContent>
					</TableTd>
				{/each}
				<TableTd />
			</TableRow>
		{/each}
	</TableBody>
	<TableFooter>
		<TableRow>
			<TableTd variant="footer" />
			{#each Array.from({ length: numColumns })}
				<TableTd variant="footer">
					<CalculationMenu />
				</TableTd>
			{/each}
			<TableTd variant="footer" />
		</TableRow>
	</TableFooter>
</TableRoot>
