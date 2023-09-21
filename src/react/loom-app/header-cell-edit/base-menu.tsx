import React from "react";

import Divider from "src/react/shared/divider";
import MenuItem from "src/react/shared/menu-item";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Switch from "src/react/shared/switch";
import Flex from "src/react/shared/flex";
import Text from "src/react/shared/text";
import Input from "src/react/shared/input";

import { CellType, SortDir } from "src/shared/loom-state/types/loom-state";
import { SubmenuType } from "./types";
import { usePlaceCursorAtEnd } from "src/shared/hooks";
import { getDisplayNameForCellType } from "src/shared/loom-state/type-display-names";

interface Props {
	canDeleteColumn: boolean;
	columnId: string;
	shouldWrapOverflow: boolean;
	columnName: string;
	cellId: string;
	columnType: CellType;
	columnSortDir: SortDir;
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
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	usePlaceCursorAtEnd(inputRef, columnName);

	React.useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputRef]);

	function handleInputChange(inputValue: string) {
		onColumnNameChange(inputValue);
	}

	const hasOptions =
		columnType === CellType.EMBED ||
		columnType === CellType.DATE ||
		columnType === CellType.NUMBER ||
		columnType === CellType.LAST_EDITED_TIME ||
		columnType === CellType.CREATION_TIME;

	return (
		<Stack spacing="sm">
			<Stack spacing="sm" width="100%">
				<Padding px="md" py="sm" width="100%">
					<Input
						ref={inputRef}
						showBorder
						value={columnName}
						onChange={handleInputChange}
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
			{columnType !== CellType.EMBED &&
				columnType !== CellType.NUMBER && (
					<>
						<Divider />
						<Padding px="lg" py="md">
							<Flex justify="space-between" align="center">
								<Text value="Wrap content" />
								<Switch
									value={shouldWrapOverflow}
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
