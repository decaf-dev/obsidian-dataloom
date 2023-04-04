import Submenu from "../Submenu";
import Button from "src/components/Button";
import Switch from "src/components/Switch";

import { CellType } from "src/services/tableState/types";
import Stack from "src/components/Stack";
import Padding from "src/components/Padding";

interface Props {
	canDeleteColumn: boolean;
	title: string;
	columnId: string;
	columnType: string;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: (columnId: string) => void;
	onBackClick: () => void;
}

export default function EditMenu({
	columnId,
	canDeleteColumn,
	title,
	columnType,
	shouldWrapOverflow,
	hasAutoWidth,
	onAutoWidthToggle,
	onWrapOverflowToggle,
	onBackClick,
	onDeleteClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding padding="md">
				<Stack spacing="md" isVertical>
					<div>
						<p className="NLT__label">Auto Width</p>
						<Switch
							isChecked={hasAutoWidth}
							onToggle={(value) =>
								onAutoWidthToggle(columnId, value)
							}
						/>
					</div>
					{!hasAutoWidth && columnType === CellType.TEXT && (
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
			</Padding>
		</Submenu>
	);
}
