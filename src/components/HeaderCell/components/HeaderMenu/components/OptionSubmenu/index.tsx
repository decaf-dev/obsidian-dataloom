import Submenu from "../Submenu";
import Button from "src/components/Button";
import Switch from "src/components/Switch";

import {
	CellType,
	CurrencyType,
	DateFormat,
} from "src/services/tableState/types";
import Stack from "src/components/Stack";
import Padding from "src/components/Padding";
import Text from "src/components/Text";
import MenuItem from "src/components/MenuItem";
import Flex from "src/components/Flex";
import {
	getDisplayNameForCurrencyType,
	getDisplayNameForDateFormat,
} from "src/services/tableState/utils";
import { SubmenuType } from "../../types";

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
			<Stack spacing="sm" isVertical>
				{type === CellType.CURRENCY && (
					<MenuItem
						name="Currency"
						value={getDisplayNameForCurrencyType(currencyType)}
						onClick={() => onSubmenuChange(SubmenuType.CURRENCY)}
					/>
				)}
				{type === CellType.TEXT && (
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
				)}
				{(type === CellType.CREATION_TIME ||
					type === CellType.LAST_EDITED_TIME) && (
					<MenuItem
						name="Date format"
						value={getDisplayNameForDateFormat(dateFormat)}
						onClick={() => onSubmenuChange(SubmenuType.DATE_FORMAT)}
					/>
				)}
				{canDeleteColumn && (
					<Padding px="lg" py="md">
						<Button onClick={() => onDeleteClick()}>Delete</Button>
					</Padding>
				)}
			</Stack>
		</Submenu>
	);
}
