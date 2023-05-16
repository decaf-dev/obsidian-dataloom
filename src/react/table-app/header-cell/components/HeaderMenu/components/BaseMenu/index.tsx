import Divider from "src/react/shared/divider";
import MenuItem from "src/react/shared/menu-item";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { CellType, SortDir } from "src/shared/table-state/types";
import { SubmenuType } from "../../types";
import { useFocusMenuInput } from "src/shared/hooks";
import { getDisplayNameForCellType } from "src/shared/table-state/display-name";

interface Props {
	isMenuVisible: boolean;
	columnName: string;
	cellId: string;
	columnType: CellType;
	columnSortDir: SortDir;
	onColumnNameChange: (cellId: string, value: string) => void;
	onSortClick: (value: SortDir) => void;
	onSubmenuChange: (value: SubmenuType) => void;
}

export default function BaseMenu({
	isMenuVisible,
	cellId,
	columnName,
	columnType,
	columnSortDir,
	onColumnNameChange,
	onSortClick,
	onSubmenuChange,
}: Props) {
	const inputRef = useFocusMenuInput(
		isMenuVisible,
		columnName,
		(value: string) => onColumnNameChange(cellId, value)
	);

	return (
		<Stack spacing="sm" isVertical>
			<Stack spacing="sm" isVertical>
				<Padding px="md" py="sm">
					<input
						ref={inputRef}
						autoFocus
						value={columnName}
						onChange={(e) =>
							onColumnNameChange(cellId, e.target.value)
						}
					/>
				</Padding>
				<MenuItem
					lucideId="list"
					name="Type"
					value={getDisplayNameForCellType(columnType)}
					onClick={() => {
						onSubmenuChange(SubmenuType.TYPE);
					}}
				/>
				<MenuItem
					lucideId="settings"
					name="Options"
					onClick={() => {
						onSubmenuChange(SubmenuType.OPTIONS);
					}}
				/>
			</Stack>
			<Divider />
			<MenuItem
				lucideId="arrow-up"
				name="Ascending"
				onClick={() => onSortClick(SortDir.ASC)}
				isSelected={columnSortDir === SortDir.ASC}
			/>
			<MenuItem
				lucideId="arrow-down"
				name="Descending"
				onClick={() => onSortClick(SortDir.DESC)}
				isSelected={columnSortDir === SortDir.DESC}
			/>
		</Stack>
	);
}
