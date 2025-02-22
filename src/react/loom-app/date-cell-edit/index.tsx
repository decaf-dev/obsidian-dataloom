import React from "react";

import Input from "src/react/shared/input";
import MenuItem from "src/react/shared/menu-item";
import MenuTrigger from "src/react/shared/menu-trigger";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";

import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import DateFormatMenu from "./date-format-menu";

import { useMenu } from "src/react/shared/menu-provider/hooks";
import {
	type LoomMenuCloseRequest,
	LoomMenuLevel,
} from "src/react/shared/menu-provider/types";
import Switch from "src/react/shared/switch";
import {
	dateTimeToDateString,
	dateTimeToTimeString,
} from "src/shared/date/date-time-conversion";
import {
	isValidDateString,
	isValidTimeString,
} from "src/shared/date/date-validation";
import {
	getDisplayNameForDateFormat,
	getDisplayNameForDateFormatSeparator,
} from "src/shared/loom-state/type-display-names";
import DateFormatSeparatorMenu from "./date-format-separator-menu";
import TimeFormatMenu from "./time-format.menu";

import { dateStringToDateTime } from "src/shared/date/date-string-conversion";
import { getCurrentDateTime } from "src/shared/date/utils";
import "./styles.css";

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

	let initialDateString = "";
	if (value !== null) {
		initialDateString = dateTimeToDateString(
			value,
			dateFormat,
			dateFormatSeparator
		);
	}
	const [dateString, setDateString] = React.useState(initialDateString);

	let initialTimeString = "";
	if (value !== null) {
		initialTimeString = dateTimeToTimeString(value, {
			hour12,
		});
	}
	const [timeString, setTimeString] = React.useState(initialTimeString);

	const [isDateInputInvalid, setDateInputInvalid] = React.useState(false);
	const [isTimeInputInvalid, setTimeInputInvalid] = React.useState(false);
	const dateInputRef = React.useRef<HTMLInputElement>(null);
	const timeInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		let timeString = "";
		if (value !== null) {
			timeString = dateTimeToTimeString(value, {
				hour12,
			});
		}
		setTimeString(timeString);
	}, [value, hour12, setTimeString]);

	React.useEffect(() => {
		let dateString = "";
		if (value !== null) {
			dateString = dateTimeToDateString(
				value,
				dateFormat,
				dateFormatSeparator
			);
		}
		setDateString(dateString);
	}, [value, dateFormat, dateFormatSeparator, setDateString]);

	React.useEffect(() => {
		if (closeRequest === null) return;

		function validateDateInput(closeRequest: LoomMenuCloseRequest) {
			if (dateString == "") return true;

			if (isValidDateString(dateString, dateFormat, dateFormatSeparator))
				return true;

			const { type } = closeRequest;
			if (type !== "close-on-save") {
				return false;
			}

			setDateInputInvalid(true);
			onCloseRequestClear();
			return false;
		}

		function validateTimeInput(closeRequest: LoomMenuCloseRequest) {
			if (!includeTime) return true;
			if (timeString === "") return true;
			if (isValidTimeString(timeString, hour12)) return true;

			const { type } = closeRequest;
			if (type !== "close-on-save") {
				return false;
			}

			setTimeInputInvalid(true);
			onCloseRequestClear();
			return false;
		}

		function getCurrentDateTime() {
			if (includeTime) {
				if (dateString !== "" && timeString !== "") {
					return dateStringToDateTime(
						dateString,
						dateFormat,
						dateFormatSeparator,
						{
							timeString,
							hour12,
						}
					);
				}
			}
			if (dateString !== "") {
				return dateStringToDateTime(
					dateString,
					dateFormat,
					dateFormatSeparator
				);
			}
			return null;
		}

		if (!validateDateInput(closeRequest)) {
			if (closeRequest.type !== "close-on-save") {
				onClose();
			}
			return;
		}

		if (!validateTimeInput(closeRequest)) {
			if (closeRequest.type !== "close-on-save") {
				onClose();
			}
			return;
		}

		const newValue = getCurrentDateTime();

		if (newValue !== value) {
			setDateInputInvalid(false);
			setTimeInputInvalid(false);
			onDateTimeChange(newValue);
		}
		onClose();
	}, [
		value,
		dateString,
		includeTime,
		hour12,
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

	function handleTodayClick() {
		onDateTimeChange(getCurrentDateTime());
		onClose();
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
							{includeTime && (
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
							)}
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
					<MenuItem name="Today" onClick={handleTodayClick} />
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
