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
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import CurrencyMenu from "./components/CurrencyMenu";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { openMenu } from "src/services/menu/menuSlice";
import DateFormatMenu from "./components/DateFormatMenu";
import Flex from "src/components/Flex";
import { isMenuOpen } from "src/services/menu/utils";

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
	onCurrencyChange: (value: CurrencyType) => void;
	onDateFormatChange: (value: DateFormat) => void;
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
	onCurrencyChange,
	onDateFormatChange,
}: Props) {
	const [menu, menuPosition] = useMenu(MenuLevel.TWO);
	const shouldOpenMenu = useAppSelector((state) =>
		isMenuOpen(state, menu.id)
	);
	const dispatch = useAppDispatch();
	const { top, left, width } = menuPosition.position;

	return (
		<>
			<Submenu title={title} onBackClick={onBackClick}>
				<Padding px="md">
					<Stack spacing="md" isVertical>
						{type === CellType.CURRENCY && (
							<div
								ref={menuPosition.containerRef}
								style={{ width: "100%" }}
							>
								<MenuItem
									name="Currency"
									value={currencyType}
									onClick={() => dispatch(openMenu(menu))}
								/>
							</div>
						)}
						{type === CellType.TEXT && (
							<Padding px="lg">
								<Flex justify="space-between">
									<Text value="Wrap Overflow" />
									<Switch
										isChecked={shouldWrapOverflow}
										onToggle={(value) =>
											onWrapOverflowToggle(
												columnId,
												value
											)
										}
									/>
								</Flex>
							</Padding>
						)}
						{(type === CellType.CREATION_TIME ||
							type === CellType.LAST_EDITED_TIME) && (
							<div
								ref={menuPosition.containerRef}
								style={{ width: "100%" }}
							>
								<MenuItem
									name="Date format"
									value={dateFormat}
									onClick={() => dispatch(openMenu(menu))}
								/>
							</div>
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
			{type === CellType.CURRENCY && (
				<CurrencyMenu
					id={menu.id}
					isOpen={shouldOpenMenu}
					top={top - 125}
					left={left + width - 50}
					value={currencyType}
					onChange={onCurrencyChange}
				/>
			)}
			{(type === CellType.CREATION_TIME ||
				type === CellType.LAST_EDITED_TIME) && (
				<DateFormatMenu
					id={menu.id}
					isOpen={shouldOpenMenu}
					top={top - 50}
					left={left + width - 50}
					value={dateFormat}
					onChange={onDateFormatChange}
				/>
			)}
		</>
	);
}
