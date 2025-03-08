<script lang="ts" module>
	import { getContext, setContext } from "svelte";

	const LOOM_STATE_KEY = "loom-state";

	export const getLoomStateContext = () =>
		getContext(LOOM_STATE_KEY) as { loomState: NewLoomState };
</script>

<script lang="ts">
	import { cloneDeep } from "lodash";
	import { createCellForType } from "./cell-factory";
	import AddColumnButton, {
		default as AddRowButton,
	} from "./components/add-column-button/add-column-button.svelte";
	import BodyContent from "./components/body-content/body-content.svelte";
	import CalculationMenu from "./components/calculation-menu/calculation-menu.svelte";
	import HeaderMenu from "./components/header-menu/header-menu.svelte";
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
	import { createLoomState } from "./loom-state.svelte";
	import { createColumn, createRow } from "./state-factory";
	import type { ParsedTableData } from "./table-parser";
	import { CellType, type CalculationType, type NewLoomState } from "./types";

	interface AppProps {
		data: ParsedTableData;
		mode: "reading" | "editing";
	}

	const { data }: AppProps = $props();

	const loomState = createLoomState(data);
	setContext(LOOM_STATE_KEY, loomState);

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

	function handleAddRowClick() {
		const prevState = cloneDeep(loomState.loomState);
		const columns = prevState.model.columns;
		const cells = columns.map((column) => {
			const { id, type } = column;
			return createCellForType(id, type);
		});

		const newRow = createRow(prevState.model.rows.length, { cells });
		const newRows = [...prevState.model.rows, newRow];
		const newState: NewLoomState = {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
			},
		};
		loomState.loomState = newState;
	}

	function handleAddColumnClick() {
		const prevState = cloneDeep(loomState.loomState);
		const { columns, rows } = prevState.model;

		const newColumn = createColumn({
			type: CellType.TEXT,
		});

		const newColumns = [...columns, newColumn];

		const newRows = rows.map((row) => {
			const newCell = createCellForType(newColumn.id, CellType.TEXT);
			return {
				...row,
				cells: [...row.cells, newCell],
			};
		});

		const newState: NewLoomState = {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				rows: newRows,
			},
		};

		loomState.loomState = newState;
	}

	function handleDeleteRowClick(rowId: string) {
		const prevState = cloneDeep(loomState.loomState);
		const newRows = prevState.model.rows.filter((row) => row.id !== rowId);
		const newState: NewLoomState = {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
			},
		};
		loomState.loomState = newState;
	}

	function handleDeleteColumnClick(columnId: string) {
		const prevState = cloneDeep(loomState.loomState);
		const newColumns = prevState.model.columns.filter(
			(column) => column.id !== columnId,
		);
		const newRows = prevState.model.rows.map((row) => {
			const newCells = row.cells.filter(
				(cell) => cell.columnId !== columnId,
			);
			return { ...row, cells: newCells };
		});

		const newState: NewLoomState = {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				rows: newRows,
			},
		};
		loomState.loomState = newState;
	}

	function handleCalculationClick(
		columnId: string,
		calculationType: CalculationType,
	) {
		const prevState = cloneDeep(loomState.loomState);
		const newColumns = prevState.model.columns.map((column) => {
			if (column.id === columnId) {
				return { ...column, calculationType };
			}
			return column;
		});

		const newState: NewLoomState = {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
			},
		};
		loomState.loomState = newState;
		menuStore.closeTop();
	}

	function handleColumnNameChange(columnId: string, value: string) {
		const prevState = cloneDeep(loomState.loomState);
		const newColumns = prevState.model.columns.map((column) => {
			if (column.id === columnId) {
				return { ...column, content: value };
			}
			return column;
		});

		const newState: NewLoomState = {
			...prevState,
			model: { ...prevState.model, columns: newColumns },
		};
		loomState.loomState = newState;
	}

	function handleCellInput(cellId: string, value: string) {
		const prevState = cloneDeep(loomState.loomState);
		const newRows = prevState.model.rows.map((row) => {
			return {
				...row,
				cells: row.cells.map((cell) =>
					cell.id === cellId ? { ...cell, content: value } : cell,
				),
			};
		});

		const newState: NewLoomState = {
			...prevState,
			model: { ...prevState.model, rows: newRows },
		};
		loomState.loomState = newState;
	}
</script>

<TableRoot>
	<TableHeader>
		<TableRow>
			<TableTh />
			{#each loomState.loomState.model.columns as header (header.id)}
				<TableTh>
					<HeaderMenu
						columnId={header.id}
						columnName={header.content}
						onColumnNameChange={handleColumnNameChange}
						onDeleteClick={handleDeleteColumnClick}
					/>
				</TableTh>
			{/each}
			<TableTh variant="add-column">
				<AddColumnButton onClick={handleAddColumnClick} />
			</TableTh>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each loomState.loomState.model.rows as row (row.id)}
			<TableRow>
				<TableTd variant="row-menu">
					<RowMenu
						rowId={row.id}
						onDeleteClick={handleDeleteRowClick}
					/>
				</TableTd>
				{#each row.cells as cell (cell.id)}
					<TableTd>
						<BodyContent
							cellId={cell.id}
							value={cell.content}
							onCellInput={handleCellInput}
						/>
					</TableTd>
				{/each}
				<TableTd />
			</TableRow>
		{/each}
	</TableBody>
	<TableFooter>
		<TableRow>
			<TableTd variant="footer" />
			{#each loomState.loomState.model.columns as column (column.id)}
				<TableTd variant="footer">
					<CalculationMenu
						columnId={column.id}
						calculationType={column.calculationType}
						onClick={handleCalculationClick}
					/>
				</TableTd>
			{/each}
			<TableTd variant="footer" />
		</TableRow>
	</TableFooter>
</TableRoot>
<div class="add-row-button-container">
	<AddRowButton onClick={handleAddRowClick} />
</div>

<style>
	.add-row-button-container {
		margin-top: 4px;
	}
</style>
