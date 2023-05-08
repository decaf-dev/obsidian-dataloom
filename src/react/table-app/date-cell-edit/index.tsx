import { useEffect, useState } from "react";

import MenuItem from "src/react/shared/menu-item";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";

import {
	dateStringToUnixTime,
	isValidDateFormat,
	unixTimeToDateString,
} from "src/shared/date/date-conversion";
import { DateFormat } from "src/shared/table-state/types";
import { useCompare, useFocusMenuInput } from "src/shared/hooks";
import DateFormatMenu from "./components/DateFormatMenu";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel, MenuPosition } from "src/shared/menu/types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";

import "./styles.css";
import MenuTrigger from "src/react/shared/menu-trigger";
import { getDisplayNameForDateFormat } from "src/shared/table-state/display-name";

interface Props {
	isMenuVisible: boolean;
	value: number | null;
	menuPosition: MenuPosition;
	menuCloseRequestTime: number | null;
	dateFormat: DateFormat;
	onDateTimeChange: (value: number | null) => void;
	onDateFormatChange: (value: DateFormat) => void;
	onMenuClose: () => void;
}

export default function DateCellEdit({
	isMenuVisible,
	value,
	menuCloseRequestTime,
	menuPosition,
	dateFormat,
	onDateTimeChange,
	onMenuClose,
	onDateFormatChange,
}: Props) {
	const [localValue, setLocalValue] = useState(
		value === null ? "" : unixTimeToDateString(value, dateFormat)
	);

	const [isInputInvalid, setInputInvalid] = useState(false);
	const [closeTime, setCloseTime] = useState(0);

	const { menu, isMenuOpen, openMenu, closeTopMenuAndFocusTrigger } = useMenu(
		MenuLevel.TWO
	);

	const inputRef = useFocusMenuInput(
		isMenuVisible,
		value?.toString() || "",
		setLocalValue
	);

	useEffect(() => {
		setLocalValue(
			value === null ? "" : unixTimeToDateString(value, dateFormat)
		);
	}, [value, dateFormat]);

	const hasCloseRequestTimeChange = useCompare(menuCloseRequestTime);
	useEffect(() => {
		function validateInput() {
			let value: number | null = null;
			//If the user has not entered a value, we don't need to validate the date format
			if (localValue !== "") {
				if (!isValidDateFormat(localValue, dateFormat)) {
					setInputInvalid(true);
					return;
				}
				//Convert local value to unix time
				value = dateStringToUnixTime(localValue, dateFormat);
			}

			setInputInvalid(false);
			onDateTimeChange(value);
			setCloseTime(Date.now());
		}

		if (hasCloseRequestTimeChange && menuCloseRequestTime !== null)
			validateInput();
	}, [hasCloseRequestTimeChange, localValue, menuCloseRequestTime]);

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
		closeTopMenuAndFocusTrigger();
	}

	function handleClearClick(e: React.MouseEvent) {
		onDateTimeChange(null);
		onMenuClose();
	}

	const { top, left } = shiftMenuIntoViewContent({
		menuId: menu.id,
		menuPositionEl: menuPosition.positionRef.current,
		menuPosition: menuPosition.position,
		topOffset: 50,
		leftOffset: 135,
	});

	return (
		<>
			<div className="NLT__date-cell-edit">
				<Stack spacing="md" isVertical>
					<Padding px="md" py="md">
						<input
							ref={inputRef}
							aria-invalid={isInputInvalid}
							autoFocus
							value={localValue}
							onChange={(e) => setLocalValue(e.target.value)}
						/>
					</Padding>
					<MenuTrigger
						menuId={menu.id}
						onClick={() => openMenu(menu)}
					>
						<MenuItem
							name="Date format"
							value={getDisplayNameForDateFormat(dateFormat)}
						/>
					</MenuTrigger>
					<MenuItem name="Clear" onClick={handleClearClick} />
				</Stack>
			</div>
			<DateFormatMenu
				id={menu.id}
				isOpen={isMenuOpen}
				top={top}
				left={left}
				value={dateFormat}
				onChange={handleDateFormatChange}
			/>
		</>
	);
}
