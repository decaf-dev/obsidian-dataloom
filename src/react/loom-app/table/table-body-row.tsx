import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useDragContext } from "src/shared/dragging/drag-context";
import { dropDrag, getRowId } from "src/shared/dragging/utils";

interface TableBodyRowProps {
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

export default function TableBodyRow({
	style,
	children,
	...props
}: TableBodyRowProps) {
	const { loomState, setLoomState } = useLoomState();
	const { dragData, setDragData } = useDragContext();

	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;

		const rowId = getRowId(el);
		if (!rowId) return;

		setDragData({
			type: "row",
			id: rowId,
		});
	}

	function handleDragEnd(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		el.draggable = false;
		setDragData(null);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		//The target will be the td element
		//The current target will be the parent tr element
		const target = e.currentTarget as HTMLElement;

		const targetId = getRowId(target);
		if (!targetId) return;

		dropDrag(targetId, dragData, loomState, setLoomState);
	}

	function handleDragOver(e: React.DragEvent) {
		//Alow drop
		e.preventDefault();
	}

	return (
		<div
			className="dataloom-row"
			onDrop={handleDrop}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			{...props}
			style={style}
		>
			{children}
		</div>
	);
}
