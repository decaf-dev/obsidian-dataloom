import { css } from "@emotion/react";
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

			const draggedElIndex = columns.findIndex(
				(column) => column.id === draggedId
			);
			const targetElIndex = columns.findIndex(
				(column) => column.id == targetId
			);

			const newColumns = structuredClone(columns);
			const draggedEl = newColumns[draggedElIndex];

			//Remove the element
			newColumns.splice(draggedElIndex, 1);
			//Append it to the new location
			newColumns.splice(targetElIndex, 0, draggedEl);

			return {
				...prevState,
				model: {
					...prevState.model,
					columns: newColumns,
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
			data-column-id={columnId}
			css={css`
				border-bottom: 1px solid var(--background-modifier-border) !important;
				border-left: 1px solid var(--background-modifier-border) !important;
				border-right: 0 !important;
				padding: 0 !important;
				font-weight: 400 !important;
				overflow: visible;
				text-align: start;
				background-color: var(--background-secondary) !important;
				position: sticky !important;
				top: 0;
				z-index: 1;

				&:first-of-type {
					border-left: 0 !important;
				}

				&:last-of-type {
					border-top: 0 !important;
					border-bottom: 0 !important;
					background-color: var(--background-primary) !important;
				}
			`}
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
