import { useTableState } from "src/shared/table-state/table-state-context";
import { TableDataTransferItem } from "./types";
import { SortDir } from "src/shared/table-state/types";

interface TableBodyRowProps {
	children?: React.ReactNode;
}

export default function TableBodyRow({
	children,
	...props
}: TableBodyRowProps) {
	const { tableState, setTableState } = useTableState();

	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		//React Virtuoso only works with our keyboard focus navigation system when we memorize the row component
		//We can only do this if we don't place a `data-row-id` attr on the row itself. The workaround to this is to place
		//the `data-row-id` attr on the last td element in the row (which contains the drag menu)
		const dragMenuEl = el.querySelector("td:last-child");
		if (!dragMenuEl) throw new Error("Couldn't find drag menu td");

		const rowId = dragMenuEl.getAttr("data-row-id");
		if (!rowId)
			throw new Error("Drag menu td must have a data-row-id attribute");

		const item: TableDataTransferItem = {
			type: "row",
			id: rowId,
		};
		e.dataTransfer.setData("application/json", JSON.stringify(item));
	}

	function handleDragEnd(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		el.draggable = false;
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		const data = e.dataTransfer.getData("application/json");
		if (data === "") throw new Error("No data found in dataTransfer");

		const item = JSON.parse(data) as TableDataTransferItem;
		//If we're dragging a column type, then return
		if (item.type !== "row") return;

		const draggedId = item.id;

		//React Virtuoso only works with our keyboard focus navigation system when we memorize the row component
		//We can only do this if we don't place a `data-row-id` attr on the row itself. The workaround to this is to place
		//the `data-row-id` attr on the last td element in the row (which contains the drag menu)
		const target = e.currentTarget as HTMLElement;
		const dragMenuEl = target.querySelector("td:last-child");
		if (!dragMenuEl) throw new Error("Couldn't find drag menu td");

		const targetId = dragMenuEl.getAttr("data-row-id");
		if (!targetId)
			throw new Error("Drag menu td must have a data-row-id attribute");

		const { columns } = tableState.model;
		const isSorted = columns.find(
			(column) => column.sortDir !== SortDir.NONE
		);
		if (isSorted) {
			if (
				!window.confirm(
					"This will set your default sorting to the current sort filter. Do you wish to continue?" +
						"\n\n" +
						"If not, please remove your sort filter before dragging a row."
				)
			)
				return;
		}

		setTableState((prevState) => {
			const { bodyRows, columns } = prevState.model;
			const rowsCopy = structuredClone(bodyRows);

			const draggedElIndex = bodyRows.findIndex(
				(row) => row.id === draggedId
			);
			const targetElIndex = bodyRows.findIndex(
				(row) => row.id == targetId
			);

			//Move the actual element
			let temp = rowsCopy[targetElIndex];
			rowsCopy[targetElIndex] = rowsCopy[draggedElIndex];
			rowsCopy[draggedElIndex] = temp;

			//Set the current index of all the values to their current positions
			//This will allow us to retain the order of sorted rows once we drag an item
			rowsCopy.forEach((row, index) => {
				row.index = index;
			});

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyRows: rowsCopy,
					columns: columns.map((column) => {
						//If we're sorting, reset the sort
						return {
							...column,
							sortDir: SortDir.NONE,
						};
					}),
				},
			};
		});
	}

	function handleDragOver(e: React.DragEvent) {
		//Alow drop
		e.preventDefault();
	}

	return (
		<tr
			draggable
			onDrop={handleDrop}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			{...props}
		>
			{children}
		</tr>
	);
}
