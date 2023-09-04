import MenuItem from "src/react/shared/menu-item";
import ModalMenu from "src/react/shared/menu/modal-menu";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";
import { ImportColumn } from "../types";
import { getIconIdForCellType } from "src/react/shared/icon/utils";

interface Props {
	id: string;
	triggerPosition: Position;
	isOpen: boolean;
	columns: ImportColumn[];
	selectedColumnId: string | null;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onColumnClick: (columnId: string) => void;
	onClose: () => void;
}

export default function SelectColumnMenu({
	id,
	triggerPosition,
	isOpen,
	columns,
	selectedColumnId,
	onColumnClick,
	onRequestClose,
	onClose,
}: Props) {
	return (
		<ModalMenu
			id={id}
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			openDirection="bottom-left"
			onClose={onClose}
		>
			{columns.map((column) => {
				const { id, name, type } = column;
				return (
					<MenuItem
						key={id}
						name={name}
						lucideId={getIconIdForCellType(type)}
						onClick={() => onColumnClick(id)}
						isSelected={id === selectedColumnId}
					/>
				);
			})}
		</ModalMenu>
	);
}
