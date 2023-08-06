import React from "react";
import Divider from "src/react/shared/divider";
import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";

interface Props {
	id: string;
	isOpen: boolean;
	top: number;
	left: number;
	onDeleteClick: () => void;
	onInsertAboveClick: () => void;
	onInsertBelowClick: () => void;
}
const RowMenu = React.forwardRef<HTMLDivElement, Props>(
	(
		{
			id,
			isOpen,
			top,
			left,
			onDeleteClick,
			onInsertAboveClick,
			onInsertBelowClick,
		}: Props,
		ref
	) => {
		return (
			<Menu id={id} isOpen={isOpen} top={top} left={left} ref={ref}>
				<div className="dataloom-row-menu">
					<MenuItem
						lucideId="trash-2"
						name="Delete"
						onClick={() => onDeleteClick()}
					/>
					<MenuItem
						lucideId="chevrons-up"
						name="Insert above"
						onClick={() => onInsertAboveClick()}
					/>
					<MenuItem
						lucideId="chevrons-down"
						name="Insert below"
						onClick={() => onInsertBelowClick()}
					/>
				</div>
			</Menu>
		);
	}
);

export default RowMenu;
