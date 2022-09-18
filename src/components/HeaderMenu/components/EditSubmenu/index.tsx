import React from "react";

import Submenu from "../Submenu";
import Button from "src/components/Button";
import Switch from "src/components/Switch";

import { CellType } from "src/services/table/types";
import Stack from "src/components/Stack";

interface Props {
	title: string;
	columnIndex: number;
	columnType: string;
	columnName: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	onNameChange: (name: string) => void;
	onAutoWidthToggle: (columnIndex: number, value: boolean) => void;
	onWrapOverflowToggle: (columnIndex: number, value: boolean) => void;
	onDeleteClick: (columnIndex: number) => void;
	onBackClick: () => void;
}

export default function EditMenu({
	title,
	columnIndex,
	columnType,
	columnName,
	shouldWrapOverflow,
	useAutoWidth,
	onNameChange,
	onAutoWidthToggle,
	onWrapOverflowToggle,
	onBackClick,
	onDeleteClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Stack spacing="5px" isVertical={true}>
				<>
					<p className="NLT__label">Header Name</p>
					<input
						className="NLT__header-menu-input"
						autoFocus
						value={columnName}
						onChange={(e) => onNameChange(e.target.value)}
					/>
				</>
				{(columnType === CellType.TEXT ||
					columnType === CellType.NUMBER) && (
					<>
						<p className="NLT__label">Auto Width</p>
						<Switch
							isChecked={useAutoWidth}
							onToggle={(value) =>
								onAutoWidthToggle(columnIndex, value)
							}
						/>
						{!useAutoWidth && (
							<>
								<p className="NLT__label">Wrap Overflow</p>
								<Switch
									isChecked={shouldWrapOverflow}
									onToggle={(value) =>
										onWrapOverflowToggle(columnIndex, value)
									}
								/>
							</>
						)}
					</>
				)}
				<Button onClick={() => onDeleteClick(columnIndex)}>
					Delete
				</Button>
			</Stack>
		</Submenu>
	);
}
