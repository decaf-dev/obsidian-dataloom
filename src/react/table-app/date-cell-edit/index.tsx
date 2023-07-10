import React from "react";

import MenuItem from "src/react/shared/menu-item";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";

import {
	dateStringToUnixTime,
	isValidDateFormat,
	unixTimeToDateString,
} from "src/shared/date/date-conversion";
import { DateFormat } from "src/shared/types";
import { useCompare } from "src/shared/hooks";
import DateFormatMenu from "./date-format-menu";
import { useMenu } from "src/shared/menu/hooks";
import { MenuCloseRequest, MenuLevel } from "src/shared/menu/types";

import MenuTrigger from "src/react/shared/menu-trigger";
import { getDisplayNameForDateFormat } from "src/shared/table-state/display-name";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { borderInputStyle } from "src/react/table-app/shared-styles";
import { css } from "@emotion/react";

interface Props {
	value: number | null;
	menuCloseRequest: MenuCloseRequest | null;
	dateFormat: DateFormat;
	onDateTimeChange: (value: number | null) => void;
	onDateFormatChange: (value: DateFormat) => void;
	onMenuClose: () => void;
}

export default function DateCellEdit({
	value,
	menuCloseRequest,
	dateFormat,
	onDateTimeChange,
	onMenuClose,
	onDateFormatChange,
}: Props) {
	const { menu, isMenuOpen, menuRef, closeTopMenu } = useMenu(MenuLevel.TWO);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "right",
		topOffset: 35,
		leftOffset: -50,
	});

	const [localValue, setLocalValue] = React.useState(
		value === null ? "" : unixTimeToDateString(value, dateFormat)
	);

	const [isInputInvalid, setInputInvalid] = React.useState(false);
	const [closeTime, setCloseTime] = React.useState(0);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	React.useEffect(() => {
		setLocalValue(
			value === null ? "" : unixTimeToDateString(value, dateFormat)
		);
	}, [value, dateFormat]);

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);
	React.useEffect(() => {
		function validateInput() {
			let newValue: number | null = null;
			//If the user has not entered a value, we don't need to validate the date format
			if (localValue !== "") {
				if (isValidDateFormat(localValue, dateFormat)) {
					//Convert local value to unix time
					newValue = dateStringToUnixTime(localValue, dateFormat);
				} else {
					if (menuCloseRequest?.type === "enter") {
						setInputInvalid(true);
						return;
					}
					newValue = value;
				}
			}

			if (newValue !== value) {
				setInputInvalid(false);
				onDateTimeChange(newValue);
			}
			setCloseTime(Date.now());
		}

		if (hasCloseRequestTimeChanged && menuCloseRequest !== null)
			validateInput();
	}, [
		value,
		hasCloseRequestTimeChanged,
		localValue,
		menuCloseRequest,
		dateFormat,
		onDateTimeChange,
		onMenuClose,
	]);

	//If we call onMenuClose directly in the validateInput function, we can see the cell markdown
	//change to the new value as the menu closes
	//If we call onMenuClose in a useEffect, we wait an entire render cycle before closing the menu
	//This allows us to see the cell markdown change to the new value before the menu closes
	React.useEffect(() => {
		if (closeTime !== 0) {
			onMenuClose();
		}
	}, [closeTime, onMenuClose]);

	function handleDateFormatChange(value: DateFormat) {
		onDateFormatChange(value);
		closeTopMenu();
	}

	function handleClearClick() {
		onDateTimeChange(null);
		onMenuClose();
	}

	return (
		<>
			<div ref={triggerRef} className="DataLoom__date-cell-edit">
				<Stack>
					<Padding>
						<input
							tabIndex={0}
							type="text"
							className="DataLoom__focusable"
							css={css`
								${borderInputStyle}
								${isInputInvalid
									? "&:focus-visible { outline: 2px solid var(--background-modifier-error) !important; }"
									: ""}
							`}
							ref={inputRef}
							autoFocus
							value={localValue}
							onChange={(e) => setLocalValue(e.target.value)}
						/>
					</Padding>
					<MenuTrigger menu={menu}>
						<MenuItem
							isFocusable={false}
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
