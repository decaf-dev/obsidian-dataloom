import Submenu from "../Submenu";
import Button from "src/components/Button";
import Switch from "src/components/Switch";

import { CellType } from "src/services/tableState/types";
import Stack from "src/components/Stack";

interface Props {
	canDeleteColumn: boolean;
	title: string;
	columnId: string;
	columnType: string;
	cellId: string;
	markdown: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	onNameChange: (columnId: string, value: string) => void;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: (columnId: string) => void;
	onBackClick: () => void;
}

export default function EditMenu({
	canDeleteColumn,
	title,
	cellId,
	columnId,
	columnType,
	markdown,
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
			<Stack spacing="sm" isVertical>
				<div>
					<p className="NLT__label">Header Name</p>
					<input
						className="NLT__header-menu-input"
						autoFocus
						value={markdown}
						onChange={(e) => onNameChange(cellId, e.target.value)}
					/>
				</div>
				<div>
					<p className="NLT__label">Auto Width</p>
					<Switch
						isChecked={useAutoWidth}
						onToggle={(value) => onAutoWidthToggle(columnId, value)}
					/>
				</div>
				{!useAutoWidth && columnType === CellType.TEXT && (
					<div>
						<p className="NLT__label">Wrap Overflow</p>
						<Switch
							isChecked={shouldWrapOverflow}
							onToggle={(value) =>
								onWrapOverflowToggle(columnId, value)
							}
						/>
					</div>
				)}
				{canDeleteColumn && (
					<Button onClick={() => onDeleteClick(columnId)}>
						Delete
					</Button>
				)}
			</Stack>
		</Submenu>
	);
}
