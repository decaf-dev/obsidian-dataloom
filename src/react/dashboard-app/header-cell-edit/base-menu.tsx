import Divider from "src/react/shared/divider";
import MenuItem from "src/react/shared/menu-item";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { CellType, SortDir } from "src/shared/types";
import { SubmenuType } from "./types";
import { useInputSelection } from "src/shared/hooks";
import { getDisplayNameForCellType } from "src/shared/table-state/display-name";
import React from "react";
import Flex from "src/react/shared/flex";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";
import { MenuCloseRequest } from "src/shared/menu/types";
import { borderInputStyle } from "src/react/dashboard-app/shared-styles";

interface Props {
	canDeleteColumn: boolean;
	columnId: string;
	shouldWrapOverflow: boolean;
	columnName: string;
	cellId: string;
	columnType: CellType;
	columnSortDir: SortDir;
	menuCloseRequest: MenuCloseRequest | null;
	onColumnNameChange: (value: string) => void;
	onSortClick: (value: SortDir) => void;
	onSubmenuChange: (value: SubmenuType) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: () => void;
	onHideClick: () => void;
}

export default function BaseMenu({
	shouldWrapOverflow,
	columnName,
	columnId,
	columnType,
	columnSortDir,
	canDeleteColumn,
	onSortClick,
	onSubmenuChange,
	onWrapOverflowToggle,
	onDeleteClick,
	onColumnNameChange,
	onHideClick,
}: Props) {
	const lastKeyPressed = React.useRef<string | null>(null);
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	useInputSelection(inputRef, columnName);

	function handleInputChange(inputValue: string) {
		onColumnNameChange(inputValue);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		lastKeyPressed.current = e.key;
	}

	const hasOptions =
		columnType === CellType.EMBED ||
		columnType === CellType.DATE ||
		columnType === CellType.CURRENCY ||
		columnType === CellType.LAST_EDITED_TIME ||
		columnType === CellType.CREATION_TIME;

	return (
		<Stack spacing="sm" isVertical>
			<Stack spacing="sm" isVertical width="100%">
				<Padding px="md" py="sm" width="100%">
					<input
						type="text"
						className="Dashboards__focusable"
						autoFocus
						css={borderInputStyle}
						ref={inputRef}
						value={columnName}
						onChange={(e) => handleInputChange(e.target.value)}
						onKeyDown={handleKeyDown}
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
				{hasOptions && (
					<MenuItem
						lucideId="settings"
						name="Options"
						onClick={() => {
							onSubmenuChange(SubmenuType.OPTIONS);
						}}
					/>
				)}
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
			<Divider />
			<MenuItem
				lucideId="eye-off"
				name="Hide"
				onClick={() => onHideClick()}
			/>
			{canDeleteColumn && (
				<MenuItem
					lucideId="trash"
					name="Delete"
					onClick={() => onDeleteClick()}
				/>
			)}
			{columnType !== CellType.EMBED && (
				<>
					<Divider />
					<Padding px="lg" py="md">
						<Flex justify="space-between" align="center">
							<Text value="Wrap content" />
							<Switch
								isChecked={shouldWrapOverflow}
								onToggle={(value) =>
									onWrapOverflowToggle(columnId, value)
								}
							/>
						</Flex>
					</Padding>
				</>
			)}
		</Stack>
	);
}
