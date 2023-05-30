import { SortDir, TableState } from "../types/types";
import { DragData } from "./types";

export const getRowId = (rowEl: HTMLElement) => {
	//React Virtuoso only works with our keyboard focus navigation system when we memorize the row component
	//We can only do this if we don't place a `data-row-id` attr on the row itself. The workaround to this is to place
	//the `data-row-id` attr on the last td element in the row (which contains the drag menu)
	const td = rowEl.firstChild as HTMLElement | null;
	if (!td) return null;

	const id = td.getAttr("data-row-id");
	return id ?? null;
};

export const dropDrag = (
	targetRowId: string,
	dragData: DragData | null,
	tableState: TableState,
	onTableStateChange: React.Dispatch<React.SetStateAction<TableState>>
) => {
	if (dragData === null) throw Error("No drag data found");

	//If we're dragging a column type, then return
	if (dragData.type !== "row") return;

	const { columns } = tableState.model;
	const isSorted = columns.find((column) => column.sortDir !== SortDir.NONE);
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

	onTableStateChange((prevState) => {
		const { bodyRows, columns } = prevState.model;

		const draggedElIndex = bodyRows.findIndex(
			(row) => row.id === dragData.id
		);
		const targetElIndex = bodyRows.findIndex(
			(row) => row.id === targetRowId
		);

		const newRows = structuredClone(bodyRows);
		const draggedEl = newRows[draggedElIndex];

		//Remove the element
		newRows.splice(draggedElIndex, 1);
		//Append it to the new location
		newRows.splice(targetElIndex, 0, draggedEl);

		//Set the current index of all the values to their current positions
		//This will allow us to retain the order of sorted rows once we drag an item
		newRows.forEach((row, index) => {
			row.index = index;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: newRows,
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
};
