import Submenu from "../Submenu";

import { CellType, CurrencyType, DateFormat } from "src/shared/types/types";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import { SubmenuType } from "../../types";
import {
	getDisplayNameForCurrencyType,
	getDisplayNameForDateFormat,
} from "src/shared/table-state/display-name";
import Text from "src/react/shared/text";

interface Props {
	title: string;
	currencyType: CurrencyType;
	type: CellType;
	dateFormat: DateFormat;
	onBackClick: () => void;
	onSubmenuChange: (value: SubmenuType) => void;
}

export default function OptionSubmenu({
	type,
	currencyType,
	title,
	dateFormat,
	onBackClick,
	onSubmenuChange,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding pt="sm" pb="lg">
				<Stack spacing="lg" isVertical>
					{(type === CellType.TEXT ||
						type === CellType.FILE ||
						type === CellType.NUMBER ||
						type === CellType.CHECKBOX ||
						type === CellType.TAG ||
						type === CellType.MULTI_TAG) && (
						<Padding px="lg">
							<Text value="No settings to display" />
						</Padding>
					)}
					{type === CellType.CURRENCY && (
						<MenuItem
							name="Currency"
							value={getDisplayNameForCurrencyType(currencyType)}
							onClick={() =>
								onSubmenuChange(SubmenuType.CURRENCY)
							}
						/>
					)}
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
				</Stack>
			</Padding>
		</Submenu>
	);
}
