import Submenu from "../Submenu";
import Button from "src/components/Button";
import Switch from "src/components/Switch";

import { CellType, CurrencyType } from "src/services/tableState/types";
import Stack from "src/components/Stack";
import Padding from "src/components/Padding";
import Text from "src/components/Text";
import MenuItem from "src/components/MenuItem";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import CurrencyMenu from "./components/CurrencyMenu";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { isMenuOpen, openMenu } from "src/services/menu/menuSlice";

interface Props {
	canDeleteColumn: boolean;
	title: string;
	columnId: string;
	columnCurrencyType: CurrencyType;
	columnType: string;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: () => void;
	onBackClick: () => void;
	onCurrencyChange: (value: CurrencyType) => void;
}

export default function OptionSubmenu({
	columnId,
	canDeleteColumn,
	columnCurrencyType,
	title,
	columnType,
	shouldWrapOverflow,
	hasAutoWidth,
	onAutoWidthToggle,
	onWrapOverflowToggle,
	onBackClick,
	onDeleteClick,
	onCurrencyChange,
}: Props) {
	const currencyMenu = useMenu(MenuLevel.TWO);
	const isCurrencyMenuOpen = useAppSelector((state) =>
		isMenuOpen(state, currencyMenu.id)
	);
	const dispatch = useAppDispatch();
	const { top, left, width } = currencyMenu.position;

	return (
		<>
			<Submenu title={title} onBackClick={onBackClick}>
				<Padding paddingY="md">
					<Stack spacing="md" isVertical>
						<Padding paddingX="lg">
							<Stack spacing="md">
								<Text value="Auto Width" />
								<Switch
									isChecked={hasAutoWidth}
									onToggle={(value) =>
										onAutoWidthToggle(columnId, value)
									}
								/>
							</Stack>
						</Padding>
						{columnType === CellType.CURRENCY && (
							<div
								ref={currencyMenu.containerRef}
								style={{ width: "100%" }}
							>
								<MenuItem
									name="Currency"
									value={columnCurrencyType}
									onClick={() =>
										dispatch(
											openMenu({
												id: currencyMenu.id,
												level: currencyMenu.level,
											})
										)
									}
								/>
							</div>
						)}
						{!hasAutoWidth && columnType === CellType.TEXT && (
							<Padding paddingX="lg">
								<Stack spacing="sm">
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
								</Stack>
							</Padding>
						)}
						{canDeleteColumn && (
							<Padding paddingX="lg">
								<Button onClick={() => onDeleteClick()}>
									Delete
								</Button>
							</Padding>
						)}
					</Stack>
				</Padding>
			</Submenu>
			<CurrencyMenu
				id={currencyMenu.id}
				isOpen={isCurrencyMenuOpen}
				top={top - 125}
				left={left + width - 50}
				value={columnCurrencyType}
				onCurrencyChange={onCurrencyChange}
			/>
		</>
	);
}
