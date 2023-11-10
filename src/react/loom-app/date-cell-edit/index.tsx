import React from "react";

import MenuItem from "src/react/shared/menu-item";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuTrigger from "src/react/shared/menu-trigger";
import Input from "src/react/shared/input";

import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import DateFormatMenu from "./date-format-menu";

import {
	getDisplayNameForDateFormat,
	getDisplayNameForDateFormatSeparator,
} from "src/shared/loom-state/type-display-names";
import {
	LoomMenuCloseRequest,
	LoomMenuLevel,
} from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";
import Switch from "src/react/shared/switch";
import DateFormatSeparatorMenu from "./date-format-separator-menu";
import {
	dateTimeToDateString,
	dateTimeToTimeString,
} from "src/shared/date/date-time-conversion";
import {
	isValidDateString,
	isValidTimeString,
} from "src/shared/date/date-validation";
import TimeFormatMenu from "./time-format.menu";

import "./styles.css";
import { dateStringToDateTime } from "src/shared/date/date-string-conversion";
import { getCurrentDateTime } from "src/shared/date/utils";

interface Props {
	cellId: string;
	value: string | null;
	closeRequest: LoomMenuCloseRequest | null;
	dateFormatSeparator: DateFormatSeparator;
	dateFormat: DateFormat;
	hour12: boolean;
	includeTime: boolean;
	onDateTimeChange: (value: string | null) => void;
	onCloseRequestClear: () => void;
	onDateFormatChange: (value: DateFormat) => void;
	onDateFormatSeparatorChange: (value: DateFormatSeparator) => void;
	onIncludeTimeToggle: (value: boolean) => void;
	onTimeFormatChange: (value: boolean) => void;
	onClose: () => void;
}

export default function DateCellEdit({
	cellId,
	value,
	includeTime,
	closeRequest,
	dateFormatSeparator,
	dateFormat,
	hour12,
	onDateTimeChange,
	onClose,
	onCloseRequestClear,
	onDateFormatSeparatorChange,
	onDateFormatChange,
	onIncludeTimeToggle,
	onTimeFormatChange,
}: Props) {
	const COMPONENT_ID = `date-format-menu-${cellId}`;

	const dateFormatMenu = useMenu(COMPONENT_ID, { name: "date-format" });
	const dateFormatSeparatorMenu = useMenu(COMPONENT_ID, {
		name: "date-separator",
	});
	const timeFormatMenu = useMenu(COMPONENT_ID, {
		name: "time-format",
	});

	const includeTimeToggleId = React.useId();

	const [dateString, setDateString] = React.useState(
		value === null
			? ""
			: dateTimeToDateString(value, dateFormat, dateFormatSeparator)
	);
	const [timeString, setTimeString] = React.useState(
		value === null
			? ""
			: dateTimeToTimeString(value, {
					hour12,
			  })
	);

	const [isDateInputInvalid, setDateInputInvalid] = React.useState(false);
	const [isTimeInputInvalid, setTimeInputInvalid] = React.useState(false);
	const dateInputRef = React.useRef<HTMLInputElement>(null);
	const timeInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		setTimeString(
			value === null
				? ""
				: dateTimeToTimeString(value, {
						hour12,
				  })
		);
	}, [value, hour12, setTimeString]);

	React.useEffect(() => {
		setDateString(
			value === null
				? ""
				: dateTimeToDateString(value, dateFormat, dateFormatSeparator)
		);
	}, [value, dateFormat, setDateString]);

	React.useEffect(() => {
		if (closeRequest === null) return;

		//If the user has not entered a value, we don't need to validate the date format
		if (dateString !== "") {
			if (
				!isValidDateString(dateString, dateFormat, dateFormatSeparator)
			) {
				if (closeRequest.type === "close-on-save") {
					setDateInputInvalid(true);
					onCloseRequestClear();
					return;
				}
			}
		}

		//If the user has not entered a value, we don't need to validate the date format
		if (dateString !== "" || timeString !== "") {
			if (!isValidTimeString(timeString, hour12)) {
				if (closeRequest.type === "close-on-save") {
					setTimeInputInvalid(true);
					onCloseRequestClear();
					return;
				}
			}
		}

		let newValue: string | null = value;
		if (dateString !== "" && timeString !== "") {
			//Convert local value to unix time
			newValue = dateStringToDateTime(
				dateString,
				dateFormat,
				dateFormatSeparator,
				{
					timeString,
					hour12,
				}
			);
		}

		if (newValue !== value) {
			setDateInputInvalid(false);
			setTimeInputInvalid(false);
			onDateTimeChange(newValue);
		}
		onClose();
	}, [
		value,
		dateString,
		,
		timeString,
		closeRequest,
		dateFormat,
		dateFormatSeparator,
		onDateTimeChange,
		onCloseRequestClear,
		onClose,
	]);

	function handleDateFormatChange(value: DateFormat) {
		onDateFormatChange(value);
		dateFormatMenu.onClose();
	}

	function handleDateFormatSeparatorChange(value: DateFormatSeparator) {
		onDateFormatSeparatorChange(value);
		dateFormatSeparatorMenu.onClose();
	}

	function handleTimeFormatChange(value: boolean) {
		onTimeFormatChange(value);
		timeFormatMenu.onClose();
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
						<Stack isHorizontal spacing="sm">
							<Input
								ref={dateInputRef}
								showBorder
								placeholder={dateTimeToDateString(
									getCurrentDateTime(),
									dateFormat,
									dateFormatSeparator
								)}
								hasError={isDateInputInvalid}
								value={dateString}
								onChange={setDateString}
							/>
							<Input
								ref={timeInputRef}
								showBorder
								autoFocus={false}
								placeholder={dateTimeToTimeString(
									getCurrentDateTime(),
									{
										hour12,
									}
								)}
								hasError={isTimeInputInvalid}
								value={timeString}
								onChange={setTimeString}
							/>
						</Stack>
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
							value={getDisplayNameForDateFormatSeparator(
								dateFormatSeparator
							)}
						/>
					</MenuTrigger>
					<Padding px="lg">
						<Stack spacing="sm">
							<label htmlFor={includeTimeToggleId}>
								Include time
							</label>
							<Switch
								id={includeTimeToggleId}
								value={includeTime}
								onToggle={onIncludeTimeToggle}
							/>
						</Stack>
					</Padding>
					{includeTime && (
						<MenuTrigger
							ref={timeFormatMenu.triggerRef}
							menuId={timeFormatMenu.id}
							variant="cell"
							isFocused={timeFormatMenu.isTriggerFocused}
							level={LoomMenuLevel.TWO}
							onOpen={() =>
								timeFormatMenu.onOpen(LoomMenuLevel.TWO)
							}
						>
							<MenuItem
								isFocusable={false}
								name="Time format"
								value={hour12 ? "12 hour" : "24 hour"}
							/>
						</MenuTrigger>
					)}
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
			<DateFormatSeparatorMenu
				id={dateFormatSeparatorMenu.id}
				isOpen={dateFormatSeparatorMenu.isOpen}
				position={dateFormatSeparatorMenu.position}
				value={dateFormatSeparator}
				onChange={handleDateFormatSeparatorChange}
			/>
			<TimeFormatMenu
				id={timeFormatMenu.id}
				isOpen={timeFormatMenu.isOpen}
				position={timeFormatMenu.position}
				value={hour12}
				onChange={handleTimeFormatChange}
			/>
		</>
	);
}
