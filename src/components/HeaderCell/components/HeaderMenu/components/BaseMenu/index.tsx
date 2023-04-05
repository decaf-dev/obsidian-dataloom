import Divider from "src/components/Divider";
import MenuItem from "src/components/MenuItem";
import Padding from "src/components/Padding";
import Stack from "src/components/Stack";
import { IconType } from "src/services/icon/types";
import { CellType, SortDir } from "src/services/tableState/types";
import { getDisplayNameForCellType } from "src/services/tableState/utils";
import { Submenu } from "../../types";

interface Props {
	columnName: string;
	cellId: string;
	rowId: string;
	columnType: CellType;
	columnSortDir: SortDir;
	numColumns: number;
	onColumnNameChange: (cellId: string, rowId: string, value: string) => void;
	onSortClick: (value: SortDir) => void;
	onSubmenuChange: (value: Submenu) => void;
}

export default function BaseMenu({
	rowId,
	cellId,
	columnName,
	columnType,
	columnSortDir,
	numColumns,
	onColumnNameChange,
	onSortClick,
	onSubmenuChange,
}: Props) {
	return (
		<Stack spacing="sm" isVertical>
			<Stack spacing="sm" isVertical>
				<Padding paddingX="md" paddingY="sm">
					<input
						autoFocus
						value={columnName}
						onChange={(e) =>
							onColumnNameChange(cellId, rowId, e.target.value)
						}
					/>
				</Padding>
				<MenuItem
					iconType={IconType.NOTES}
					name="Type"
					value={getDisplayNameForCellType(columnType)}
					onClick={() => onSubmenuChange(Submenu.TYPE)}
				/>
				<MenuItem
					iconType={IconType.TUNE}
					name="Options"
					onClick={() => onSubmenuChange(Submenu.OPTIONS)}
				/>
			</Stack>
			<Divider />
			<MenuItem
				iconType={IconType.ARROW_UPWARD}
				name="Ascending"
				onClick={() => onSortClick(SortDir.ASC)}
				isSelected={columnSortDir === SortDir.ASC}
			/>
			<MenuItem
				iconType={IconType.ARROW_DOWNWARD}
				name="Descending"
				onClick={() => onSortClick(SortDir.DESC)}
				isSelected={columnSortDir === SortDir.DESC}
			/>
			<Divider />
			<MenuItem
				iconType={IconType.MOVE_UP}
				name="Move"
				onClick={() => onSubmenuChange(Submenu.MOVE)}
			/>
			{numColumns > 1 && (
				<MenuItem
					iconType={IconType.KEYBOARD_DOUBLE_ARROW_RIGHT}
					name="Insert"
					onClick={() => onSubmenuChange(Submenu.INSERT)}
				/>
			)}
		</Stack>
	);
}
