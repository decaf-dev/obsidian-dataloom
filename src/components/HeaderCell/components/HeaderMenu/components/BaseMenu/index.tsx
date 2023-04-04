import Divider from "src/components/Divider";
import MenuItem from "src/components/MenuItem";
import Padding from "src/components/Padding";
import Stack from "src/components/Stack";
import { IconType } from "src/services/icon/types";
import { CellType, SortDir } from "src/services/tableState/types";
import { getDisplayNameForCellType } from "src/services/tableState/utils";
import { SubmenuItem, SUBMENU_ITEM } from "../../constants";
import "./styles.css";

interface Props {
	columnName: string;
	cellId: string;
	rowId: string;
	columnType: CellType;
	columnSortDir: SortDir;
	numColumns: number;
	onColumnNameChange: (cellId: string, rowId: string, value: string) => void;
	onSortClick: (value: SortDir) => void;
	onSubmenuChange: (value: SubmenuItem) => void;
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
					iconType={SUBMENU_ITEM.TYPE.icon}
					name={SUBMENU_ITEM.TYPE.content}
					value={getDisplayNameForCellType(columnType)}
					onClick={() => onSubmenuChange(SUBMENU_ITEM.TYPE)}
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
			{[SUBMENU_ITEM.EDIT, SUBMENU_ITEM.MOVE, SUBMENU_ITEM.INSERT]
				.filter((value) => {
					if (
						numColumns === 1 &&
						value.name === SUBMENU_ITEM.MOVE.name
					)
						return false;
					return true;
				})
				.map((item) => (
					<MenuItem
						key={item.name}
						name={item.content}
						iconType={item.icon}
						onClick={() => onSubmenuChange(item)}
					/>
				))}
		</Stack>
	);
}
