import MenuItem from "src/react/shared/menu-item";
import ModalMenu from "src/react/shared/menu/modal-menu";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";
import { ColumnMatch, ImportColumn } from "../types";
import { getIconIdForCellType } from "src/react/shared/icon/utils";
import Divider from "src/react/shared/divider";
import { NEW_COLUMN_ID } from "../constants";

interface Props {
	id: string;
	triggerPosition: Position;
	isOpen: boolean;
	columns: ImportColumn[];
	columnMatches: ColumnMatch[];
	selectedColumnId: string | null;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onColumnClick: (columnId: string | null) => void;
	onClose: () => void;
}

export default function SelectColumnMenu({
	id,
	triggerPosition,
	isOpen,
	columns,
	columnMatches,
	selectedColumnId,
	onColumnClick,
	onRequestClose,
	onClose,
}: Props) {
	const columnsToDisplay = columns.filter((column) => {
		const { id } = column;
		if (id === selectedColumnId) return true;
		return !columnMatches.some((match) => match.columnId === id);
	});
	return (
		<ModalMenu
			id={id}
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			openDirection="bottom-left"
			onClose={onClose}
		>
			{columnsToDisplay.map((column) => {
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
			<Divider />
			<MenuItem
				name="New column"
				onClick={() => onColumnClick(NEW_COLUMN_ID)}
				isSelected={selectedColumnId === NEW_COLUMN_ID}
			/>
			{selectedColumnId !== null && (
				<>
					<Divider />
					<MenuItem
						name="Unmatch"
						onClick={() => onColumnClick(null)}
					/>
				</>
			)}
		</ModalMenu>
	);
}
