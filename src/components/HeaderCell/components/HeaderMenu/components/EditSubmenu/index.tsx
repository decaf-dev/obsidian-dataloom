import Submenu from "../Submenu";
import Button from "src/components/Button";
import Switch from "src/components/Switch";

import { CellType } from "src/services/tableState/types";
import Stack from "src/components/Stack";
import Padding from "src/components/Padding";
import Text from "src/components/Text";

interface Props {
	canDeleteColumn: boolean;
	title: string;
	columnId: string;
	columnType: string;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: () => void;
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
						<Text value="Auto Width" />
						<Switch
							isChecked={hasAutoWidth}
							onToggle={(value) =>
								onAutoWidthToggle(columnId, value)
							}
						/>
					</div>
					{!hasAutoWidth && columnType === CellType.TEXT && (
						<div>
							<Text value="Wrap Overflow" />
							<Switch
								isChecked={shouldWrapOverflow}
								onToggle={(value) =>
									onWrapOverflowToggle(columnId, value)
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
