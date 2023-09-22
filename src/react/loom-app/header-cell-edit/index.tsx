import React, { useState } from "react";

import Menu from "src/react/shared/menu";
import OptionSubmenu from "./option-submenu";
import TypeSubmenu from "./type-submenu";
import BaseMenu from "./base-menu";
import NumberFormatSubmenu from "./number-format-submenu";
import TextInputSubmenu from "./text-input-submenu";
import DateFormatSubmenu from "./date-format-submenu";
import AspectRatioSubmenu from "./aspect-ratio-submenu";
import PaddingSubmenu from "./padding-submenu";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
	PaddingSize,
	NumberFormat,
} from "src/shared/loom-state/types/loom-state";
import { SubmenuType } from "./types";

import {
	LoomMenuCloseRequest,
	LoomMenuCloseRequestType,
	Position,
} from "../../shared/menu/types";
import "./styles.css";

interface Props {
	isOpen: boolean;
	canDeleteColumn: boolean;
	id: string;
	dateFormat: DateFormat;
	triggerPosition: Position;
	currencyType: CurrencyType;
	numberPrefix: string;
	numberSuffix: string;
	numberSeparator: string;
	numberFormat: NumberFormat;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
	content: string;
	shouldWrapOverflow: boolean;
	columnSortDir: SortDir;
	columnType: CellType;
	closeRequest: LoomMenuCloseRequest | null;
	columnId: string;
	numColumns: number;
	onTypeSelect: (columnId: string, type: CellType) => void;
	onSortClick: (columnId: string, sortDir: SortDir) => void;
	onDeleteClick: (columnId: string) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onContentChange: (columnid: string, value: string) => void;
	onNumberFormatChange: (
		columnId: string,
		value: NumberFormat,
		options?: {
			currency: CurrencyType;
		}
	) => void;
	onNumberPrefixChange: (columnId: string, value: string) => void;
	onNumberSuffixChange: (columnId: string, value: string) => void;
	onNumberSeparatorChange: (columnId: string, value: string) => void;
	onDateFormatChange: (columnId: string, value: DateFormat) => void;
	onAspectRatioClick: (columnId: string, value: AspectRatio) => void;
	onHorizontalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onVerticalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onHideClick: (columnId: string) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

const SELFHANDLE_CLOSE: SubmenuType[] = [
	SubmenuType.TEXT_INPUT_NUMBER_SUFFIX,
	SubmenuType.TEXT_INPUT_NUMBER_PREFIX,
	SubmenuType.TEXT_INPUT_NUMBER_SEPARATOR,
];

export default function HeaderMenu({
	isOpen,
	id,
	triggerPosition,
	content,
	dateFormat,
	currencyType,
	numberFormat,
	numberPrefix,
	numberSuffix,
	numberSeparator,
	horizontalPadding,
	verticalPadding,
	aspectRatio,
	canDeleteColumn,
	columnType,
	columnSortDir,
	columnId,
	closeRequest,
	shouldWrapOverflow,
	onTypeSelect,
	onVerticalPaddingClick,
	onHorizontalPaddingClick,
	onAspectRatioClick,
	onSortClick,
	onDeleteClick,
	onClose,
	onWrapOverflowToggle,
	onContentChange,
	onNumberFormatChange,
	onNumberPrefixChange,
	onNumberSuffixChange,
	onNumberSeparatorChange,
	onDateFormatChange,
	onHideClick,
	onRequestClose,
}: Props) {
	const [submenu, setSubmenu] = useState<SubmenuType | null>(null);
	const [localValue, setLocalValue] = useState(content);

	React.useEffect(() => {
		if (closeRequest !== null) {
			//If we're on the base menu
			if (submenu === null) {
				if (localValue !== content)
					onContentChange(columnId, localValue);
			}
			if (!submenu || !SELFHANDLE_CLOSE.includes(submenu)) {
				onClose();
			}
		}
	}, [
		content,
		columnId,
		closeRequest,
		submenu,
		localValue,
		onContentChange,
		onClose,
	]);

	function handleSortClick(sortDir: SortDir) {
		onSortClick(columnId, sortDir);
		onClose();
	}

	function handleAspectRatioClick(value: AspectRatio) {
		onAspectRatioClick(columnId, value);
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleHorizontalPaddingClick(value: PaddingSize) {
		onHorizontalPaddingClick(columnId, value);
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleVerticalPaddingClick(value: PaddingSize) {
		onVerticalPaddingClick(columnId, value);
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleTypeClick(type: CellType) {
		onTypeSelect(columnId, type);
		onClose();
		setSubmenu(null);
	}

	function handleHideClick() {
		onHideClick(columnId);
		onClose();
		setSubmenu(null);
	}

	function handleDeleteClick() {
		onDeleteClick(columnId);
		onClose();
		setSubmenu(null);
	}

	function handleNumberFormatChange(
		value: NumberFormat,
		options?: {
			currency: CurrencyType;
		}
	) {
		onNumberFormatChange(columnId, value, options);
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleNumberOptionChange(value: string) {
		submenu === SubmenuType.TEXT_INPUT_NUMBER_PREFIX &&
			onNumberPrefixChange(columnId, value);
		submenu === SubmenuType.TEXT_INPUT_NUMBER_SUFFIX &&
			onNumberSuffixChange(columnId, value);
		submenu === SubmenuType.TEXT_INPUT_NUMBER_SEPARATOR &&
			onNumberSeparatorChange(columnId, value);
		setSubmenu(null);
	}

	function handleDateFormatClick(value: DateFormat) {
		onDateFormatChange(columnId, value);
		setSubmenu(SubmenuType.OPTIONS);
	}

	return (
		<Menu
			isOpen={isOpen}
			id={id}
			triggerPosition={triggerPosition}
			width={175}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<div className="dataloom-header-menu">
				{submenu === null && (
					<BaseMenu
						canDeleteColumn={canDeleteColumn}
						shouldWrapOverflow={shouldWrapOverflow}
						columnId={columnId}
						columnName={localValue}
						columnType={columnType}
						columnSortDir={columnSortDir}
						onColumnNameChange={setLocalValue}
						onSortClick={handleSortClick}
						onSubmenuChange={setSubmenu}
						onWrapOverflowToggle={onWrapOverflowToggle}
						onDeleteClick={handleDeleteClick}
						onHideClick={handleHideClick}
					/>
				)}
				{submenu === SubmenuType.OPTIONS && (
					<OptionSubmenu
						title="Options"
						type={columnType}
						horizontalPadding={horizontalPadding}
						verticalPadding={verticalPadding}
						aspectRatio={aspectRatio}
						dateFormat={dateFormat}
						numberFormat={numberFormat}
						currencyType={currencyType}
						numberPrefix={numberPrefix}
						numberSuffix={numberSuffix}
						numberSeparator={numberSeparator}
						onBackClick={() => setSubmenu(null)}
						onSubmenuChange={setSubmenu}
					/>
				)}
				{submenu === SubmenuType.ASPECT_RATIO && (
					<AspectRatioSubmenu
						title="Aspect ratio"
						value={aspectRatio}
						onValueClick={handleAspectRatioClick}
						onBackClick={() => setSubmenu(null)}
					/>
				)}

				{submenu === SubmenuType.HORIZONTAL_PADDING && (
					<PaddingSubmenu
						title="Horizontal padding"
						value={horizontalPadding}
						onValueClick={handleHorizontalPaddingClick}
						onBackClick={() => setSubmenu(null)}
					/>
				)}

				{submenu === SubmenuType.VERTICAL_PADDING && (
					<PaddingSubmenu
						title="Vertical padding"
						value={verticalPadding}
						onValueClick={handleVerticalPaddingClick}
						onBackClick={() => setSubmenu(null)}
					/>
				)}
				{submenu === SubmenuType.TYPE && (
					<TypeSubmenu
						title="Type"
						value={columnType}
						onValueClick={handleTypeClick}
						onBackClick={() => setSubmenu(null)}
					/>
				)}
				{submenu === SubmenuType.DATE_FORMAT && (
					<DateFormatSubmenu
						title="Date Format"
						value={dateFormat}
						onValueClick={handleDateFormatClick}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.CURRENCY && (
					<NumberFormatSubmenu
						title="Currency"
						format={numberFormat}
						currency={currencyType}
						onNumberFormatChange={handleNumberFormatChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TEXT_INPUT_NUMBER_PREFIX && (
					<TextInputSubmenu
						title="Prefix"
						value={numberPrefix}
						closeRequest={closeRequest}
						onClose={onClose}
						onValueChange={handleNumberOptionChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TEXT_INPUT_NUMBER_SUFFIX && (
					<TextInputSubmenu
						title="Suffix"
						closeRequest={closeRequest}
						onClose={onClose}
						value={numberSuffix}
						onValueChange={handleNumberOptionChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TEXT_INPUT_NUMBER_SEPARATOR && (
					<TextInputSubmenu
						title="Separator"
						closeRequest={closeRequest}
						onClose={onClose}
						value={numberSeparator}
						onValueChange={handleNumberOptionChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
			</div>
		</Menu>
	);
}
