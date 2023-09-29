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
	Column,
} from "src/shared/loom-state/types/loom-state";
import { SubmenuType } from "./types";

import {
	LoomMenuCloseRequest,
	LoomMenuCloseRequestType,
	Position,
} from "../../shared/menu/types";
import "./styles.css";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";

interface Props {
	index: number;
	isOpen: boolean;
	canDeleteColumn: boolean;
	id: string;
	numFrozenColumns: number;
	triggerPosition: Position;
	column: Column;
	closeRequest: LoomMenuCloseRequest | null;
	numColumns: number;
	onColumnChange: ColumnChangeHandler;
	onColumnTypeChange: (columnId: string, type: CellType) => void;
	onColumnDeleteClick: (columnId: string) => void;
	onFrozenColumnsChange: (value: number) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

const SELFHANDLE_CLOSE: SubmenuType[] = [
	SubmenuType.TEXT_INPUT_NUMBER_SUFFIX,
	SubmenuType.TEXT_INPUT_NUMBER_PREFIX,
	SubmenuType.TEXT_INPUT_NUMBER_SEPARATOR,
];

export default function HeaderMenu({
	index,
	isOpen,
	column,
	id,
	triggerPosition,
	numFrozenColumns,
	canDeleteColumn,
	closeRequest,
	onColumnDeleteClick,
	onClose,
	onRequestClose,
	onFrozenColumnsChange,
	onColumnChange,
	onColumnTypeChange,
}: Props) {
	const {
		id: columnId,
		content,
		type,
		sortDir,
		dateFormat,
		aspectRatio,
		verticalPadding,
		horizontalPadding,
		shouldWrapOverflow,
		numberFormat,
		currencyType,
		numberPrefix,
		numberSeparator,
		numberSuffix,
	} = column;
	const [submenu, setSubmenu] = useState<SubmenuType | null>(null);
	const [localValue, setLocalValue] = useState(content);

	React.useEffect(() => {
		if (closeRequest !== null) {
			//If we're on the base menu
			if (submenu === null) {
				if (localValue !== content)
					onColumnChange(columnId, { content: localValue });
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
		onColumnChange,
		onClose,
	]);

	function handleWrapOverflowToggle() {}

	function handleSortClick(sortDir: SortDir) {
		onColumnChange(columnId, { sortDir }, { shouldSortRows: true });
		onClose();
	}

	function handleAspectRatioClick(value: AspectRatio) {
		onColumnChange(columnId, { aspectRatio: value });
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleHorizontalPaddingClick(value: PaddingSize) {
		onColumnChange(columnId, { horizontalPadding: value });
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleVerticalPaddingClick(value: PaddingSize) {
		onColumnChange(columnId, { verticalPadding: value });
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleTypeClick(type: CellType) {
		onColumnTypeChange(columnId, type);
		onClose();
		setSubmenu(null);
	}

	function handleFrozenColumnsChange(value: number) {
		onFrozenColumnsChange(value);
		onClose();
		setSubmenu(null);
	}

	function handleHideClick() {
		onColumnChange(columnId, { isVisible: false });
		onClose();
		setSubmenu(null);
	}

	function handleDeleteClick() {
		onColumnDeleteClick(columnId);
		onClose();
		setSubmenu(null);
	}

	function handleNumberFormatChange(
		value: NumberFormat,
		options?: {
			currency: CurrencyType;
		}
	) {
		onColumnChange(
			columnId,
			{
				numberFormat: value,
				...(options?.currency && {
					currencyType: options.currency,
				}),
			},
			{ shouldSortRows: true }
		);
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleNumberOptionChange(value: string) {
		submenu === SubmenuType.TEXT_INPUT_NUMBER_PREFIX &&
			onColumnChange(
				columnId,
				{ numberPrefix: value },
				{ shouldSortRows: true }
			);
		submenu === SubmenuType.TEXT_INPUT_NUMBER_SUFFIX &&
			onColumnChange(
				columnId,
				{ numberSuffix: value },
				{ shouldSortRows: true }
			);
		submenu === SubmenuType.TEXT_INPUT_NUMBER_SEPARATOR &&
			onColumnChange(
				columnId,
				{ numberSeparator: value },
				{ shouldSortRows: true }
			);
		setSubmenu(null);
	}

	function handleDateFormatClick(value: DateFormat) {
		onColumnChange(columnId, { dateFormat: value });
		setSubmenu(SubmenuType.OPTIONS);
	}

	return (
		<Menu
			isOpen={isOpen}
			id={id}
			triggerPosition={triggerPosition}
			width={190}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<div className="dataloom-header-menu">
				{submenu === null && (
					<BaseMenu
						index={index}
						canDeleteColumn={canDeleteColumn}
						shouldWrapOverflow={shouldWrapOverflow}
						numFrozenColumns={numFrozenColumns}
						columnId={columnId}
						columnName={localValue}
						columnType={type}
						columnSortDir={sortDir}
						onColumnNameChange={setLocalValue}
						onSortClick={handleSortClick}
						onSubmenuChange={setSubmenu}
						onWrapOverflowToggle={handleWrapOverflowToggle}
						onDeleteClick={handleDeleteClick}
						onHideClick={handleHideClick}
						onFrozenColumnsChange={handleFrozenColumnsChange}
					/>
				)}
				{submenu === SubmenuType.OPTIONS && (
					<OptionSubmenu
						title="Options"
						type={type}
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
						value={type}
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
