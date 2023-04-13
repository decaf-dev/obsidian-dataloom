import { useTableState } from "src/services/tableState/useTableState";
import { RenderTableBodyRow } from "../../types";
import TableCell from "../TableCell";
import { SortDir } from "src/services/tableState/types";

interface TableRowProps {
	row: RenderTableBodyRow;
}

export const TableBodyRow = ({ row }: TableRowProps) => {
	const [tableState, setTableState] = useTableState();

	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;

		const rowId = el.getAttr("data-row-id");
		if (!rowId) throw new Error("data-row-id is required for a row");
		e.dataTransfer.setData("text", rowId);
	}

	function handleDragEnd(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		el.draggable = false;
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		const { columns } = tableState.model;
		const isSorted = columns.find(
			(column) => column.sortDir !== SortDir.NONE
		);
		if (isSorted) {
			if (
				!window.confirm(
					"This will update your default sorting to the current sort filter. Do you wish to continue?" +
						"\n\n" +
						"If not, please remove your sort filter before dragging a row."
				)
			)
				return;
		}

		const draggedId = e.dataTransfer.getData("text");
		const targetId = (e.currentTarget as HTMLElement).getAttr(
			"data-row-id"
		);
		if (!targetId) throw new Error("data-row-id is required for a row");

		setTableState((prevState) => {
			const { rows, columns } = prevState.model;
			const rowsCopy = [...rows];

			const draggedElIndex = rows.findIndex(
				(row) => row.id === draggedId
			);
			const targetElIndex = rows.findIndex((row) => row.id == targetId);

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
					rows: rowsCopy,
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
			id={row.id}
			data-row-id={row.id}
			className="NLT__tr"
			onDrop={handleDrop}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			{row.cells.map((cell) => (
				<TableCell key={cell.id} content={cell.content} />
			))}
		</tr>
	);
};
