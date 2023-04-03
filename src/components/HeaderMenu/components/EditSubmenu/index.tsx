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
	useAutoWidth: boolean;
	onAutoWidthToggle: (value: boolean) => void;
	onWrapOverflowToggle: (value: boolean) => void;
	onDeleteClick: () => void;
	onBackClick: () => void;
}

export default function EditMenu({
	canDeleteColumn,
	title,
	columnType,
	shouldWrapOverflow,
	useAutoWidth,
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
							isChecked={useAutoWidth}
							onToggle={(value) => onAutoWidthToggle(value)}
						/>
					</div>
					{!useAutoWidth && columnType === CellType.TEXT && (
						<div>
							<p className="NLT__label">Wrap Overflow</p>
							<Switch
								isChecked={shouldWrapOverflow}
								onToggle={(value) =>
									onWrapOverflowToggle(value)
								}
							/>
						</div>
					)}
					{canDeleteColumn && (
						<Button onClick={() => onDeleteClick()}>Delete</Button>
					)}
				</Stack>
			</Padding>
		</Submenu>
	);
}
