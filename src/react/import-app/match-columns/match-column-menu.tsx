import MenuItem from "src/react/shared/menu-item";
import ModalMenu from "src/react/shared/model-menu";
import { LoomMenuPosition } from "src/react/shared/menu/types";
import { ColumnMatch } from "../types";
import { getIconIdForCellType } from "src/react/shared/icon/utils";
import Divider from "src/react/shared/divider";
import { NEW_COLUMN_ID } from "../constants";
import { Column } from "src/shared/loom-state/types/loom-state";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	columns: Column[];
	columnMatches: ColumnMatch[];
	selectedColumnId: string | null;
	onColumnClick: (columnId: string | null) => void;
}

export default function MatchColumnMenu({
	id,
	position,
	isOpen,
	columns,
	columnMatches,
	selectedColumnId,
	onColumnClick,
}: Props) {
	return (
		<ModalMenu
			id={id}
			isOpen={isOpen}
			position={position}
			openDirection="bottom-left"
		>
			{columns.map((column) => {
				const { id, content, type } = column;
				const isDisabled = columnMatches.some(
					(match) => match.columnId === id
				);

				return (
					<MenuItem
						key={id}
						name={content}
						isDisabled={isDisabled}
						lucideId={getIconIdForCellType(type)}
						onClick={() => onColumnClick(id)}
						isSelected={id === selectedColumnId}
					/>
				);
			})}
			<Divider />
			<MenuItem
				name="Match as new"
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
