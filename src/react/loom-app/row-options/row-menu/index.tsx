import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";

interface Props {
	id: string;
	isOpen: boolean;
	triggerPosition: Position;
	canDeleteRow: boolean;
	onDeleteClick: () => void;
	onInsertAboveClick: () => void;
	onInsertBelowClick: () => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}
export default function RowOptions({
	id,
	isOpen,
	triggerPosition,
	canDeleteRow,
	onDeleteClick,
	onInsertAboveClick,
	onInsertBelowClick,
	onRequestClose,
	onClose,
}: Props) {
	return (
		<Menu
			id={id}
			isOpen={isOpen}
			openDirection="bottom-right"
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			onClose={onClose}
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
