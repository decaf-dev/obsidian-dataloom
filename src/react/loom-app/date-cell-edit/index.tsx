import React from "react";

import MenuItem from "src/react/shared/menu-item";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuTrigger from "src/react/shared/menu-trigger";
import Input from "src/react/shared/input";

import {
	dateStringToUnixTime,
	isValidDateFormat,
	unixTimeToDateString,
} from "src/shared/date/date-conversion";
import { DateFormat } from "src/shared/loom-state/types/loom-state";
import DateFormatMenu from "./date-format-menu";

import { getDisplayNameForDateFormat } from "src/shared/loom-state/type-display-names";
import { useMenu } from "../../shared/menu/hooks";
import { LoomMenuCloseRequest, LoomMenuLevel } from "../../shared/menu/types";

interface Props {
	value: number | null;
	closeRequest: LoomMenuCloseRequest | null;
	dateFormat: DateFormat;
	onDateTimeChange: (value: number | null) => void;
	onDateFormatChange: (value: DateFormat) => void;
	onClose: () => void;
}

export default function DateCellEdit({
	value,
	closeRequest,
	dateFormat,
	onDateTimeChange,
	onClose,
	onDateFormatChange,
}: Props) {
	const {
		menu: dateFormatMenu,
		triggerRef: dateFormatMenuTriggerRef,
		triggerPosition: dateFormatMenuTriggerPosition,
		isOpen: isDateFormatMenuOpen,
		onOpen: onDateFormatMenuOpen,
		onClose: onDateFormatMenuClose,
		onRequestClose: onDateFormatMenuRequestClose,
	} = useMenu({ level: LoomMenuLevel.TWO });

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

	React.useEffect(() => {
		if (closeRequest !== null) {
			let newValue: number | null = null;

			//If the user has not entered a value, we don't need to validate the date format
			if (localValue !== "") {
				if (isValidDateFormat(localValue, dateFormat)) {
					//Convert local value to unix time
					newValue = dateStringToUnixTime(localValue, dateFormat);
				} else {
					if (closeRequest.type === "close-on-save") {
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
	}, [
		value,
		localValue,
		closeRequest,
		dateFormat,
		onDateTimeChange,
		onClose,
	]);

	//If we call onMenuClose directly in the validateInput function, we can see the cell markdown
	//change to the new value as the menu closes
	//If we call onMenuClose in a useEffect, we wait an entire render cycle before closing the menu
	//This allows us to see the cell markdown change to the new value before the menu closes
	React.useEffect(() => {
		if (closeTime !== 0) {
			onClose();
		}
	}, [closeTime, onClose]);

	function handleDateFormatChange(value: DateFormat) {
		onDateFormatChange(value);
		onDateFormatMenuClose();
	}

	function handleClearClick() {
		onDateTimeChange(null);
		onClose();
	}

	return (
		<>
			<div className="dataloom-date-cell-edit">
				<Stack>
					<Padding p="md">
						<Input
							ref={inputRef}
							showBorder
							hasError={isInputInvalid}
							value={localValue}
							onChange={setLocalValue}
						/>
					</Padding>
					<MenuTrigger
						ref={dateFormatMenuTriggerRef}
						menu={dateFormatMenu}
						onOpen={onDateFormatMenuOpen}
					>
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
				id={dateFormatMenu.id}
				isOpen={isDateFormatMenuOpen}
				triggerPosition={dateFormatMenuTriggerPosition}
				value={dateFormat}
				onChange={handleDateFormatChange}
				onRequestClose={onDateFormatMenuRequestClose}
				onClose={onDateFormatMenuClose}
			/>
		</>
	);
}
