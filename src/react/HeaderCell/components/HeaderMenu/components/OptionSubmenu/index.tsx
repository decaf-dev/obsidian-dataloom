import Submenu from "../Submenu";
import Button from "src/react/shared/Button";
import Switch from "src/react/shared/Switch";

import { CellType, CurrencyType, DateFormat } from "src/data/types";
import Stack from "src/react/shared/Stack";
import Padding from "src/react/shared/Padding";
import Text from "src/react/shared/Text";
import MenuItem from "src/react/shared/MenuItem";
import Flex from "src/react/shared/Flex";
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
