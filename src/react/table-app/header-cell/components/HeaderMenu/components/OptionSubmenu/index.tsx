import Submenu from "../Submenu";
import { Button } from "src/react/shared/button";
import Switch from "src/react/shared/switch";

import {
	CellType,
	CurrencyType,
	DateFormat,
} from "src/shared/table-state/types";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import Text from "src/react/shared/text";
import MenuItem from "src/react/shared/menu-item";
import Flex from "src/react/shared/flex";
import { SubmenuType } from "../../types";
import {
	getDisplayNameForCurrencyType,
	getDisplayNameForDateFormat,
} from "src/shared/table-state/display-name";

interface Props {
	canDeleteColumn: boolean;
	title: string;
	columnId: string;
	currencyType: CurrencyType;
	type: CellType;
	dateFormat: DateFormat;
	shouldWrapOverflow: boolean;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: () => void;
	onBackClick: () => void;
	onSubmenuChange: (value: SubmenuType) => void;
}

export default function OptionSubmenu({
	columnId,
	canDeleteColumn,
	type,
	currencyType,
	title,
	dateFormat,
	shouldWrapOverflow,
	onWrapOverflowToggle,
	onBackClick,
	onDeleteClick,
	onSubmenuChange,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding pt="sm" pb="lg">
				<Stack spacing="lg" isVertical>
					{type === CellType.CURRENCY && (
						<MenuItem
							name="Currency"
							value={getDisplayNameForCurrencyType(currencyType)}
							onClick={() =>
								onSubmenuChange(SubmenuType.CURRENCY)
							}
						/>
					)}
					<Padding px="lg">
						<Flex justify="space-between">
							<Text value="Wrap overflow" />
							<Switch
								isChecked={shouldWrapOverflow}
								onToggle={(value) =>
									onWrapOverflowToggle(columnId, value)
								}
							/>
						</Flex>
					</Padding>
					{(type === CellType.CREATION_TIME ||
						type === CellType.LAST_EDITED_TIME ||
						type === CellType.DATE) && (
						<MenuItem
							name="Date format"
							value={getDisplayNameForDateFormat(dateFormat)}
							onClick={() =>
								onSubmenuChange(SubmenuType.DATE_FORMAT)
							}
						/>
					)}
					{canDeleteColumn && (
						<Padding px="lg">
							<Button onClick={() => onDeleteClick()}>
								Delete
							</Button>
						</Padding>
					)}
				</Stack>
			</Padding>
		</Submenu>
	);
}
