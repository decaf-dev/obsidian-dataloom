import React from "react";

import Submenu from "../Submenu";
import Button from "src/components/Button";
import Switch from "src/components/Switch";

import { CellType } from "src/services/table/types";
import Stack from "src/components/Stack";

interface Props {
	canDeleteColumn: boolean;
	title: string;
	columnId: string;
	columnType: string;
	columnContent: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	onNameChange: (name: string) => void;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: (columnId: string) => void;
	onBackClick: () => void;
}

export default function EditMenu({
	canDeleteColumn,
	title,
	columnId,
	columnType,
	columnContent,
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
			<>
				<p className="NLT__label">Header Name</p>
				<input
					className="NLT__header-menu-input"
					autoFocus
					value={columnContent}
					onChange={(e) => onNameChange(e.target.value)}
				/>
			</>
			{(columnType === CellType.TEXT ||
				columnType === CellType.NUMBER) && (
				<>
					<p className="NLT__label">Auto Width</p>
					<Switch
						isChecked={useAutoWidth}
						onToggle={(value) => onAutoWidthToggle(columnId, value)}
					/>
					{!useAutoWidth && (
						<>
							<p className="NLT__label">Wrap Overflow</p>
							<Switch
								isChecked={shouldWrapOverflow}
								onToggle={(value) =>
									onWrapOverflowToggle(columnId, value)
								}
							/>
						</>
					)}
				</>
			)}
			{canDeleteColumn && (
				<Button onClick={() => onDeleteClick(columnId)}>Delete</Button>
			)}
		</Submenu>
	);
}
