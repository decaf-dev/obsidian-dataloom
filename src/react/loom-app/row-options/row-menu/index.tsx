import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import { LoomMenuPosition } from "src/react/shared/menu/types";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	canDeleteRow: boolean;
	onDeleteClick: () => void;
	onInsertAboveClick: () => void;
	onInsertBelowClick: () => void;
}
export default function RowOptions({
	id,
	isOpen,
	position,
	canDeleteRow,
	onDeleteClick,
	onInsertAboveClick,
	onInsertBelowClick,
}: Props) {
	return (
		<Menu
			id={id}
			isOpen={isOpen}
			openDirection="bottom-right"
			position={position}
		>
			<div className="dataloom-row-menu">
				{canDeleteRow && (
					<MenuItem
						lucideId="trash-2"
						name="Delete"
						onClick={() => onDeleteClick()}
					/>
				)}
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
