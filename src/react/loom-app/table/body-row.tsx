import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useDragContext } from "src/shared/dragging/drag-context";
import { getRowId } from "src/shared/dragging/utils";
import { confirmSortOrderChange } from "src/shared/sort-utils";
import { RowReorderHandler } from "../app/hooks/use-row/types";

interface Props {
	style?: React.CSSProperties;
	children?: React.ReactNode;
	onRowReorder: RowReorderHandler;
}

export default function BodyRow({
	style,
	children,
	onRowReorder,
	...props
}: Props) {
	const { loomState } = useLoomState();
	const { dragData, setDragData } = useDragContext();

	console.log("BodyRow render");

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

		if (dragData === null) throw Error("No drag data found");

		//If we're dragging a column type, then return
		if (dragData.type !== "row") return;

		if (!confirmSortOrderChange(loomState)) return;

		onRowReorder(dragData.id, targetId);
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
