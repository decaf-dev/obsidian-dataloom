import Divider from "src/components/Divider";
import Flex from "src/components/Flex";
import Icon from "src/components/Icon";
import MenuItem from "src/components/MenuItem";
import Padding from "src/components/Padding";
import Stack from "src/components/Stack";
import { IconType } from "src/services/icon/types";
import { CellType, SortDir } from "src/services/tableState/types";
import { SubmenuItem, SUBMENU_ITEM } from "../../constants";
import "./styles.css";

interface Props {
	columnName: string;
	columnType: CellType;
	columnSortDir: SortDir;
	numColumns: number;
	onColumnNameChange: (value: string) => void;
	onSortClick: (value: SortDir) => void;
	onSubmenuChange: (value: SubmenuItem) => void;
}

export default function BaseMenu({
	columnName,
	columnType,
	columnSortDir,
	numColumns,
	onColumnNameChange,
	onSortClick,
	onSubmenuChange,
}: Props) {
	return (
		<Stack spacing="md" isVertical>
			<Stack spacing="md" isVertical>
				<Padding paddingX="md" paddingY="sm">
					<input
						className="NLT__header-menu-input"
						autoFocus
						value={columnName}
						onChange={(e) => onColumnNameChange(e.target.value)}
					/>
				</Padding>
				<MenuItem
					iconType={SUBMENU_ITEM.TYPE.icon}
					name={SUBMENU_ITEM.TYPE.content}
					value={columnType}
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
