import React from "react";

import MenuItem from "src/react/shared/menu-item";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuTrigger from "src/react/shared/menu-trigger";
import Input from "src/react/shared/input";

import {
	isValidDateFormat,
	dateTimeToDateString,
} from "src/shared/date/date-conversion";
import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import DateFormatMenu from "./date-format-menu";

import { getDisplayNameForDateFormat } from "src/shared/loom-state/type-display-names";
import {
	LoomMenuCloseRequest,
	LoomMenuLevel,
} from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";
import Switch from "src/react/shared/switch";
import { dateStringToDateTime } from "src/react/import-app/date-utils";

interface Props {
	cellId: string;
	value: string | null;
	closeRequest: LoomMenuCloseRequest | null;
	dateFormatSeparator: DateFormatSeparator;
	dateFormat: DateFormat;
	includeTime: boolean;
	onDateTimeChange: (value: string | null) => void;
	onCloseRequestClear: () => void;
	onDateFormatChange: (value: DateFormat) => void;
	onIncludeTimeToggle: (value: boolean) => void;
	onClose: () => void;
}

export default function DateCellEdit({
	cellId,
	value,
	includeTime,
	dateFormatSeparator,
	closeRequest,
	dateFormat,
	onDateTimeChange,
	onClose,
	onCloseRequestClear,
	onDateFormatChange,
	onIncludeTimeToggle,
}: Props) {
	const COMPONENT_ID = `date-format-menu-${cellId}`;
	const dateFormatMenu = useMenu(COMPONENT_ID, { name: "date-format" });
	const dateFormatSeparatorMenu = useMenu(COMPONENT_ID, {
		name: "date-separator",
	});

	const [localValue, setLocalValue] = React.useState(
		value === null
			? ""
			: dateTimeToDateString(value, dateFormat, dateFormatSeparator)
	);

	const [isInputInvalid, setInputInvalid] = React.useState(false);
	const [closeTime, setCloseTime] = React.useState(0);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	React.useEffect(() => {
		setLocalValue(
			value === null
				? ""
				: dateTimeToDateString(value, dateFormat, dateFormatSeparator)
		);
	}, [value, dateFormat]);

	React.useEffect(() => {
		if (closeRequest !== null) {
			let newValue: string | null = null;

			//If the user has not entered a value, we don't need to validate the date format
			if (localValue !== "") {
				if (isValidDateFormat(localValue, dateFormat)) {
					//Convert local value to unix time
					newValue = dateStringToDateTime(
						localValue,
						dateFormat,
						dateFormatSeparator
					);
				} else {
					if (closeRequest.type === "close-on-save") {
						setInputInvalid(true);
						onCloseRequestClear();
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
		onCloseRequestClear,
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
		dateFormatMenu.onClose();
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
						ref={dateFormatMenu.triggerRef}
						menuId={dateFormatMenu.id}
						variant="cell"
						isFocused={dateFormatMenu.isTriggerFocused}
						level={LoomMenuLevel.TWO}
						onOpen={() => dateFormatMenu.onOpen(LoomMenuLevel.TWO)}
					>
						<MenuItem
							isFocusable={false}
							name="Date format"
							value={getDisplayNameForDateFormat(dateFormat)}
						/>
					</MenuTrigger>
					<MenuTrigger
						ref={dateFormatSeparatorMenu.triggerRef}
						menuId={dateFormatSeparatorMenu.id}
						variant="cell"
						isFocused={dateFormatSeparatorMenu.isTriggerFocused}
						level={LoomMenuLevel.TWO}
						onOpen={() =>
							dateFormatSeparatorMenu.onOpen(LoomMenuLevel.TWO)
						}
					>
						<MenuItem
							isFocusable={false}
							name="Date separator"
							value={dateFormatSeparator}
						/>
					</MenuTrigger>
					<Padding px="lg">
						<Stack spacing="sm">
							<label htmlFor="includeTimeId">Include time</label>
							<Switch
								value={includeTime}
								onToggle={onIncludeTimeToggle}
							/>
						</Stack>
					</Padding>
					<MenuItem name="Clear" onClick={handleClearClick} />
				</Stack>
			</div>
			<DateFormatMenu
				id={dateFormatMenu.id}
				isOpen={dateFormatMenu.isOpen}
				position={dateFormatMenu.position}
				value={dateFormat}
				onChange={handleDateFormatChange}
			/>
		</>
	);
}
