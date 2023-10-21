import MenuItem from "src/react/shared/menu-item";
import ModalMenu from "src/react/shared/model-menu";
import { LoomMenuPosition } from "src/react/shared/menu/types";
import { ColumnMatch, ImportColumn } from "../types";
import { getIconIdForCellType } from "src/react/shared/icon/utils";
import Divider from "src/react/shared/divider";
import { NEW_COLUMN_ID } from "../constants";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	columns: ImportColumn[];
	columnMatches: ColumnMatch[];
	selectedColumnId: string | null;
	onColumnClick: (columnId: string | null) => void;
}

export default function SelectColumnMenu({
	id,
	position,
	isOpen,
	columns,
	columnMatches,
	selectedColumnId,
	onColumnClick,
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
			position={position}
			openDirection="bottom-left"
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
				name="Insert new column"
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
