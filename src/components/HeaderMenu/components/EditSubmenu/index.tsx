import React from "react";

import Submenu from "../Submenu";
import Button from "src/components/Button";
import Switch from "src/components/Switch";

import { CellType } from "src/services/appData/state/types";
import Stack from "src/components/Stack";

interface Props {
	title: string;
	headerId: string;
	headerType: string;
	headerName: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	onHeaderNameChange: (name: string) => void;
	onAutoWidthToggle: (headerId: string, val: boolean) => void;
	onWrapOverflowToggle: (headerId: string, val: boolean) => void;
	onHeaderDeleteClick: (headerId: string) => void;
	onBackClick: () => void;
}

export default function EditMenu({
	title,
	headerId,
	headerType,
	headerName,
	shouldWrapOverflow,
	useAutoWidth,
	onHeaderNameChange,
	onAutoWidthToggle,
	onWrapOverflowToggle,
	onBackClick,
	onHeaderDeleteClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Stack spacing="5px" isVertical={true}>
				<>
					<p className="NLT__label">Header Name</p>
					<input
						className="NLT__header-menu-input"
						autoFocus
						value={headerName}
						onChange={(e) => onHeaderNameChange(e.target.value)}
					/>
				</>
				{(headerType === CellType.TEXT ||
					headerType === CellType.NUMBER) && (
					<>
						<p className="NLT__label">Auto Width</p>
						<Switch
							isChecked={useAutoWidth}
							onToggle={(value) =>
								onAutoWidthToggle(headerId, value)
							}
						/>
						{!useAutoWidth && (
							<>
								<p className="NLT__label">Wrap Overflow</p>
								<Switch
									isChecked={shouldWrapOverflow}
									onToggle={(value) =>
										onWrapOverflowToggle(headerId, value)
									}
								/>
							</>
						)}
					</>
				)}
				<Button onClick={() => onHeaderDeleteClick(headerId)}>
					Delete
				</Button>
			</Stack>
		</Submenu>
	);
}
