<script lang="ts">
	import MenuStore from "./components/menu/menu-store";
	import Table from "./components/table/table.svelte";
	import type { ParsedTableData } from "./utils";

	interface AppProps {
		data: ParsedTableData;
		mode: "reading" | "editing";
	}

	const { mode, data }: AppProps = $props();

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

<Table {mode} {data} />
