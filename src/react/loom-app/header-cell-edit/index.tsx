import React, { useState } from "react";

import Menu from "src/react/shared/menu";
import OptionSubmenu from "./option-submenu";
import TypeSubmenu from "./type-submenu";
import BaseMenu from "./base-menu";
import CurrencySubmenu from "./currency-submenu";
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
} from "src/shared/loom-state/types";
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
	numberSeperator: string;
	rowId: string;
	cellId: string;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
	markdown: string;
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
	onNameChange: (cellId: string, value: string) => void;
	onCurrencyChange: (columnId: string, value: CurrencyType) => void;
	onNumberPrefixChange: (columnId: string, value: string) => void;
	onNumberSuffixChange: (columnId: string, value: string) => void;
	onNumberSeperatorChange: (columnId: string, value: string) => void;
	onDateFormatChange: (columnId: string, value: DateFormat) => void;
	onAspectRatioClick: (columnId: string, value: AspectRatio) => void;
	onHorizontalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onVerticalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onHideClick: (columnId: string) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	isOpen,
	id,
	triggerPosition,
	cellId,
	markdown,
	dateFormat,
	currencyType,
	numberPrefix,
	numberSuffix,
	numberSeperator,
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
	onNameChange,
	onCurrencyChange,
	onNumberPrefixChange,
	onNumberSuffixChange,
	onNumberSeperatorChange,
	onDateFormatChange,
	onHideClick,
	onRequestClose,
}: Props) {
	const [submenu, setSubmenu] = useState<SubmenuType | null>(null);
	const [localValue, setLocalValue] = useState(markdown);

	React.useEffect(() => {
		if (closeRequest !== null) {
			//If we're on the base menu
			if (submenu === null) {
				if (localValue !== markdown) onNameChange(cellId, localValue);
			}
			onClose();
		}
	}, [
		markdown,
		cellId,
		closeRequest,
		submenu,
		localValue,
		onNameChange,
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

	function handleCurrencyClick(value: CurrencyType) {
		onCurrencyChange(columnId, value);
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleNumberPrefixChange(value: string) {
		onNumberPrefixChange(columnId, value);
		setSubmenu(SubmenuType.OPTIONS);
	}
	function handleNumberSuffixChange(value: string) {
		onNumberSuffixChange(columnId, value);
		setSubmenu(SubmenuType.OPTIONS);
	}
	function handleNumberSeperatorChange(value: string) {
		onNumberSeperatorChange(columnId, value);
		setSubmenu(SubmenuType.OPTIONS);
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
						cellId={cellId}
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
						currencyType={currencyType}
						numberPrefix={numberPrefix}
						numberSuffix={numberSuffix}
						numberSeperator={numberSeperator}
						onBackClick={() => setSubmenu(null)}
						onSubmenuChange={setSubmenu}
					/>
				)}
				{submenu === SubmenuType.ASPECT_RATIO && (
					<AspectRatioSubmenu
						title="Aspect Ratio"
						value={aspectRatio}
						onValueClick={handleAspectRatioClick}
						onBackClick={() => setSubmenu(null)}
					/>
				)}

				{submenu === SubmenuType.HORIZONTAL_PADDING && (
					<PaddingSubmenu
						title="Horizontal Padding"
						value={horizontalPadding}
						onValueClick={handleHorizontalPaddingClick}
						onBackClick={() => setSubmenu(null)}
					/>
				)}

				{submenu === SubmenuType.VERTICAL_PADDING && (
					<PaddingSubmenu
						title="Vertical Padding"
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
					<CurrencySubmenu
						title="Currency"
						value={currencyType}
						onValueClick={handleCurrencyClick}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TEXT_INPUT_NUMBER_PREFIX && (
					<TextInputSubmenu
						title="Prefix"
						value={numberPrefix}
						onValueChange={handleNumberPrefixChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TEXT_INPUT_NUMBER_SUFFIX && (
					<TextInputSubmenu
						title="Suffix"
						value={numberSuffix}
						onValueChange={handleNumberSuffixChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TEXT_INPUT_NUMBER_SEPERATOR && (
					<TextInputSubmenu
						title="Seperator"
						value={numberSeperator}
						onValueChange={handleNumberSeperatorChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
			</div>
		</Menu>
	);
}
