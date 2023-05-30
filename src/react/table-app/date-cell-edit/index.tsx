import React, { useEffect, useState } from "react";

import MenuItem from "src/react/shared/menu-item";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";

import {
	dateStringToUnixTime,
	isValidDateFormat,
	unixTimeToDateString,
} from "src/shared/date/date-conversion";
import { DateFormat } from "src/shared/types/types";
import { useCompare } from "src/shared/hooks";
import DateFormatMenu from "./components/DateFormatMenu";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";

import MenuTrigger from "src/react/shared/menu-trigger";
import { getDisplayNameForDateFormat } from "src/shared/table-state/display-name";
import { css } from "@emotion/react";
import { getTableBackgroundColor, getTableBorderColor } from "src/shared/color";

import "./styles.css";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";

interface Props {
	value: number | null;
	menuCloseRequestTime: number | null;
	dateFormat: DateFormat;
	onDateTimeChange: (value: number | null) => void;
	onDateFormatChange: (value: DateFormat) => void;
	onMenuClose: () => void;
}

export default function DateCellEdit({
	value,
	menuCloseRequestTime,
	dateFormat,
	onDateTimeChange,
	onMenuClose,
	onDateFormatChange,
}: Props) {
	const { menu, isMenuOpen, menuRef, openMenu, closeTopMenu } = useMenu(
		MenuLevel.TWO
	);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "right",
		topOffset: 35,
		leftOffset: -50,
	});

	const [localValue, setLocalValue] = useState(
		value === null ? "" : unixTimeToDateString(value, dateFormat)
	);

	const [isInputInvalid, setInputInvalid] = useState(false);
	const [closeTime, setCloseTime] = useState(0);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

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
	}, [
		hasCloseRequestTimeChange,
		localValue,
		menuCloseRequestTime,
		dateFormat,
	]);

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
		closeTopMenu();
	}

	function handleClearClick(e: React.MouseEvent) {
		onDateTimeChange(null);
		onMenuClose();
	}

	const tableBackgroundColor = getTableBackgroundColor();
	const tableBorderColor = getTableBorderColor();

	return (
		<>
			<div ref={triggerRef} className="NLT__date-cell-edit">
				<Stack spacing="md" isVertical>
					<Padding px="md" py="md">
						<input
							css={css`
								width: 100%;
								height: 100%;
								border: 1px solid ${tableBorderColor};
								padding: 5px;
								background-color: ${tableBackgroundColor};
							`}
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
				ref={menuRef}
				top={triggerPosition.top}
				left={triggerPosition.left}
				value={dateFormat}
				onChange={handleDateFormatChange}
			/>
		</>
	);
}
