import MenuItem from "src/components/MenuItem";
import { useEffect, useState } from "react";
import Stack from "src/components/Stack";
import Padding from "src/components/Padding";
import DateConversion from "src/services/date/DateConversion";
import { DateFormat } from "src/services/tableState/types";
import { useCompare } from "src/services/hooks";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";

import DateFormatMenu from "./components/DateFormatMenu";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { isMenuOpen } from "src/services/menu/utils";
import { closeTopLevelMenu, openMenu } from "src/services/menu/menuSlice";
import { getDisplayNameForDateFormat } from "src/services/tableState/utils";

import "./styles.css";

interface Props {
	value: number | null;
	closeMenuRequestTime: number | null;
	dateFormat: DateFormat;
	onDateTimeChange: (value: number | null) => void;
	onDateFormatChange: (value: DateFormat) => void;
	onMenuClose: () => void;
}

export default function DateCellEdit({
	value,
	closeMenuRequestTime,
	dateFormat,
	onDateTimeChange,
	onMenuClose,
	onDateFormatChange,
}: Props) {
	const [localValue, setLocalValue] = useState(
		value === null
			? ""
			: DateConversion.unixTimeToDateString(value, dateFormat)
	);

	const [isInputInvalid, setInputInvalid] = useState(false);
	const [closeTime, setCloseTime] = useState(0);

	const [menu, menuPosition] = useMenu(MenuLevel.TWO);
	const shouldOpenMenu = useAppSelector((state) =>
		isMenuOpen(state, menu.id)
	);
	const dispatch = useAppDispatch();

	useEffect(() => {
		setLocalValue(
			value === null
				? ""
				: DateConversion.unixTimeToDateString(value, dateFormat)
		);
	}, [value, dateFormat]);

	const didCloseMenuRequestTimeChange = useCompare(closeMenuRequestTime);
	useEffect(() => {
		function validateInput() {
			let value: number | null = null;
			//If the user has not entered a value, we don't need to validate the date format
			if (localValue !== "") {
				if (!DateConversion.isValidDateFormat(localValue, dateFormat)) {
					setInputInvalid(true);
					return;
				}
				//Convert local value to unix time
				value = DateConversion.dateStringToUnixTime(
					localValue,
					dateFormat
				);
			}

			setInputInvalid(false);
			onDateTimeChange(value);
			setCloseTime(Date.now());
		}

		if (didCloseMenuRequestTimeChange && closeMenuRequestTime !== null)
			validateInput();
	}, [didCloseMenuRequestTimeChange, localValue, closeMenuRequestTime]);

	//If we call onMenuClose directly in the validateInput function, we can see the cell markdown
	//change to the new value as the menu closes
	//If we call onMenuClose in a useEffect, we wait an entire render cycle before closing the menu
	//This allows us to see the cell markdown change to the new value before the menu closes
	useEffect(() => {
		if (closeTime !== 0) {
			onMenuClose();
		}
	}, [closeTime]);

	function handleDateFormatChange(value: DateFormat) {
		onDateFormatChange(value);
		dispatch(closeTopLevelMenu());
	}

	function handleClearClick(e: React.MouseEvent) {
		//Prevent the menu from reopening when it clsoes
		e.stopPropagation();

		onDateTimeChange(null);
		onMenuClose();
	}

	const { top, left, width } = menuPosition.position;

	return (
		<>
			<div className="NLT__date-cell-edit">
				<Stack spacing="md" isVertical>
					<Padding px="md" py="md">
						<input
							aria-invalid={isInputInvalid}
							autoFocus
							value={localValue}
							onChange={(e) => setLocalValue(e.target.value)}
						/>
					</Padding>
					<div
						ref={menuPosition.containerRef}
						style={{ width: "100%" }}
					>
						<MenuItem
							name="Date format"
							value={getDisplayNameForDateFormat(dateFormat)}
							onClick={() => dispatch(openMenu(menu))}
						/>
					</div>
					<MenuItem name="Clear" onClick={handleClearClick} />
				</Stack>
			</div>
			<DateFormatMenu
				id={menu.id}
				isOpen={shouldOpenMenu}
				top={top - 25}
				left={left + width - 25}
				value={dateFormat}
				onChange={handleDateFormatChange}
			/>
		</>
	);
}
