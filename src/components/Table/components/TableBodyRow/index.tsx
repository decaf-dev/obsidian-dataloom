import { useTableState } from "src/services/tableState/useTableState";
import { RenderTableBodyRow } from "../../types";
import TableCell from "../TableCell";
import { sortByRowIndex } from "src/services/tableState/sort";

interface TableRowProps {
	row: RenderTableBodyRow;
}

export const TableBodyRow = ({ row }: TableRowProps) => {
	const [, setTableState] = useTableState();

	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		const rowId = el.getAttr("data-row-id");
		if (!rowId) throw new Error("data-row-id is required for a row");
		e.dataTransfer.setData("text", rowId);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		const draggedId = e.dataTransfer.getData("text");
		const targetId = (e.currentTarget as HTMLElement).getAttr(
			"data-row-id"
		);
		if (!targetId) throw new Error("data-row-id is required for a row");

		setTableState((prevState) => {
			const { rows } = prevState.model;
			const rowsCopy = [...rows];

			const draggedElIndex = rows.findIndex(
				(row) => row.id === draggedId
			);
			const targetElIndex = rows.findIndex((row) => row.id == targetId);

			let temp = rowsCopy[targetElIndex].index;
			rowsCopy[targetElIndex].index = rowsCopy[draggedElIndex].index;
			rowsCopy[draggedElIndex].index = temp;

			return {
				...prevState,
				model: {
					...prevState.model,
					rows: sortByRowIndex(rowsCopy),
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
			draggable
			onDrop={handleDrop}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onMouseDown={(e) => {
				const el = e.target as HTMLElement;
				//If we're not dragging on the row menu button, prevent drag and drop
				if (!el.closest(`.NLT__row-menu-button`)) e.preventDefault();
			}}
		>
			{row.cells.map((cell) => (
				<TableCell key={cell.id} content={cell.content} />
			))}
		</tr>
	);
};
