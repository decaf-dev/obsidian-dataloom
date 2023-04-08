import { useTableState } from "src/services/tableState/useTableState";
import { sortCells } from "src/services/tableState/utils";

interface TableHeaderCellProps {
	columnId: string;
	content: React.ReactNode;
}

export default function TableHeaderCell({
	columnId,
	content,
}: TableHeaderCellProps) {
	const [, setTableState] = useTableState();

	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		const columnId = el.getAttr("data-column-id");
		if (!columnId)
			throw new Error("data-column-id is required for a header cell");
		e.dataTransfer.setData("text", columnId);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		const draggedId = e.dataTransfer.getData("text");
		const targetId = (e.currentTarget as HTMLElement).getAttr(
			"data-column-id"
		);
		if (!targetId)
			throw new Error("data-column-id is required for a header cell");

		setTableState((prevState) => {
			const { columns, rows, cells } = prevState.model;
			const columnsCopy = [...columns];

			const draggedElIndex = columns.findIndex(
				(column) => column.id === draggedId
			);
			const targetElIndex = columns.findIndex(
				(column) => column.id == targetId
			);

			let temp = columnsCopy[targetElIndex];
			columnsCopy[targetElIndex] = columnsCopy[draggedElIndex];
			columnsCopy[draggedElIndex] = temp;

			const updatedCells = sortCells(columnsCopy, rows, cells);

			return {
				...prevState,
				model: {
					...prevState.model,
					columns: columnsCopy,
					cells: updatedCells,
				},
			};
		});
	}

	function handleDragOver(e: React.DragEvent) {
		//Alow drop
		e.preventDefault();
	}

	return (
		<th
			className="NLT__th"
			data-column-id={columnId}
			draggable
			onDrop={handleDrop}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
		>
			{content}
		</th>
	);
}
