import { TableDataTransferItem } from "src/react/table-app/table/types";
import { useTableState } from "src/shared/table-state/table-state-context";

interface TableHeaderCellProps {
	columnId: string;
	content: React.ReactNode;
	isDraggable: boolean;
}

export default function TableHeaderCell({
	columnId,
	content,
	isDraggable,
}: TableHeaderCellProps) {
	const { setTableState } = useTableState();

	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		const columnId = el.getAttr("data-column-id");
		if (!columnId)
			throw new Error("data-column-id is required for a header cell");

		const item: TableDataTransferItem = {
			type: "column",
			id: columnId,
		};
		e.dataTransfer.setData("application/json", JSON.stringify(item));
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		const data = e.dataTransfer.getData("application/json");
		const item = JSON.parse(data) as TableDataTransferItem;
		//If we're dragging a column type, then return
		if (item.type !== "column") return;

		const draggedId = item.id;
		const targetId = (e.currentTarget as HTMLElement).getAttr(
			"data-column-id"
		);
		if (!targetId)
			throw new Error("data-column-id is required for a header cell");

		setTableState((prevState) => {
			const { columns } = prevState.model;
			const columnsCopy = structuredClone(columns);

			const draggedElIndex = columns.findIndex(
				(column) => column.id === draggedId
			);
			const targetElIndex = columns.findIndex(
				(column) => column.id == targetId
			);

			let temp = columnsCopy[targetElIndex];
			columnsCopy[targetElIndex] = columnsCopy[draggedElIndex];
			columnsCopy[draggedElIndex] = temp;

			return {
				...prevState,
				model: {
					...prevState.model,
					columns: columnsCopy,
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
			{...(isDraggable && {
				draggable: true,
				onDrop: handleDrop,
				onDragStart: handleDragStart,
				onDragOver: handleDragOver,
			})}
		>
			{content}
		</th>
	);
}
