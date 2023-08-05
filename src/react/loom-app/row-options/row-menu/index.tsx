import React from "react";
import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";

interface Props {
	id: string;
	rowId: string;
	isOpen: boolean;
	top: number;
	left: number;
	onDeleteClick: (id: string) => void;
}
const RowMenu = React.forwardRef<HTMLDivElement, Props>(function RowMenu(
	{ id, rowId, isOpen, top, left, onDeleteClick }: Props,
	ref
) {
	return (
		<Menu id={id} isOpen={isOpen} top={top} left={left} ref={ref}>
			<div className="dataloom-row-menu">
				<MenuItem
					lucideId="trash-2"
					name="Delete"
					onClick={() => onDeleteClick(rowId)}
				/>
			</div>
		</Menu>
	);
});

export default RowMenu;
