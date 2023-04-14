import Divider from "src/components/Divider";
import MenuItem from "src/components/MenuItem";
import Padding from "src/components/Padding";
import Stack from "src/components/Stack";
import { IconType } from "src/services/icon/types";
import { CellType, SortDir } from "src/services/tableState/types";
import { getDisplayNameForCellType } from "src/services/tableState/utils";
import { SubmenuType } from "../../types";

interface Props {
	columnName: string;
	cellId: string;
	rowId: string;
	columnType: CellType;
	columnSortDir: SortDir;
	onColumnNameChange: (cellId: string, rowId: string, value: string) => void;
	onSortClick: (value: SortDir) => void;
	onSubmenuChange: (value: SubmenuType) => void;
}

export default function BaseMenu({
	rowId,
	cellId,
	columnName,
	columnType,
	columnSortDir,
	onColumnNameChange,
	onSortClick,
	onSubmenuChange,
}: Props) {
	return (
		<Stack spacing="sm" isVertical>
			<Stack spacing="sm" isVertical>
				<Padding px="md" py="sm">
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
					onClick={() => onSubmenuChange(SubmenuType.TYPE)}
				/>
				<MenuItem
					iconType={IconType.TUNE}
					name="Options"
					onClick={() => onSubmenuChange(SubmenuType.OPTIONS)}
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
		</Stack>
	);
}
