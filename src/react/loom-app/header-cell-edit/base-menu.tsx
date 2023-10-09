import React from "react";

import Divider from "src/react/shared/divider";
import MenuItem from "src/react/shared/menu-item";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Switch from "src/react/shared/switch";
import Flex from "src/react/shared/flex";
import Text from "src/react/shared/text";
import Input from "src/react/shared/input";

import {
	CellType,
	FrontmatterKey,
	SortDir,
} from "src/shared/loom-state/types/loom-state";
import { SubmenuType } from "./types";
import { usePlaceCursorAtEnd } from "src/shared/hooks";
import { getDisplayNameForCellType } from "src/shared/loom-state/type-display-names";

interface Props {
	index: number;
	canDeleteColumn: boolean;
	numSources: number;
	columnId: string;
	shouldWrapOverflow: boolean;
	frontmatterKey: FrontmatterKey | null;
	columnName: string;
	numFrozenColumns: number;
	columnType: CellType;
	columnSortDir: SortDir;
	onColumnNameChange: (value: string) => void;
	onSortClick: (value: SortDir) => void;
	onSubmenuChange: (value: SubmenuType) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: () => void;
	onHideClick: () => void;
	onFrozenColumnsChange: (value: number) => void;
}

export default function BaseMenu({
	index,
	shouldWrapOverflow,
	numFrozenColumns,
	numSources,
	frontmatterKey,
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
	onFrozenColumnsChange,
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
						isDisabled={
							columnType === CellType.SOURCE ||
							columnType === CellType.SOURCE_FILE
						}
						showBorder
						value={columnName}
						onChange={handleInputChange}
					/>
				</Padding>
				{columnType !== CellType.SOURCE &&
					columnType !== CellType.SOURCE_FILE && (
						<MenuItem
							lucideId="list"
							name="Type"
							value={getDisplayNameForCellType(columnType)}
							onClick={() => {
								onSubmenuChange(SubmenuType.TYPE);
							}}
						/>
					)}
				{numSources > 0 &&
					columnType !== CellType.SOURCE &&
					columnType !== CellType.SOURCE_FILE && (
						<MenuItem
							lucideId="file-key-2"
							name="Frontmatter key"
							value={frontmatterKey?.value || "No key set"}
							onClick={() => {
								onSubmenuChange(SubmenuType.FRONTMATTER_KEY);
							}}
						/>
					)}
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
			{index < 4 && numFrozenColumns !== index + 2 && (
				<MenuItem
					lucideId="pin"
					name="Freeze up to column"
					onClick={() => onFrozenColumnsChange(index + 2)}
				/>
			)}
			{numFrozenColumns === index + 2 && (
				<MenuItem
					lucideId="pin-off"
					name="Unfreeze columns"
					onClick={() => onFrozenColumnsChange(1)}
				/>
			)}
			{canDeleteColumn && (
				<MenuItem
					lucideId="trash"
					name="Delete"
					onClick={() => onDeleteClick()}
				/>
			)}
			{columnType !== CellType.EMBED &&
				columnType !== CellType.NUMBER &&
				columnType !== CellType.SOURCE && (
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
