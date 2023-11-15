import React from "react";

import Menu from "src/react/shared/menu";
import OptionSubmenu from "./option-submenu";
import TypeSubmenu from "./type-submenu";
import NumberFormatSubmenu from "./number-format-submenu";
import TextInputSubmenu from "./text-input-submenu";
import DateFormatSubmenu from "./date-format-submenu";
import AspectRatioSubmenu from "./aspect-ratio-submenu";
import PaddingSubmenu from "./padding-submenu";
import FrontmatterKeySubmenu from "./frontmatter-key-submenu";
import BaseSubmenu from "./base-submenu";
import DateFormatSeparatorSubmenu from "./date-format-separator-submenu";
import TimeFormatSubmenu from "./time-format-submenu";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
	PaddingSize,
	NumberFormat,
	Column,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import { SubmenuType } from "./types";
import { LoomMenuPosition } from "../../shared/menu/types";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";
import { LoomMenuCloseRequest } from "src/react/shared/menu-provider/types";

import "./styles.css";

interface Props {
	index: number;
	numSources: number;
	isOpen: boolean;
	canDeleteColumn: boolean;
	frontmatterKeys: {
		value: string;
		isSelectable: boolean;
	}[];
	id: string;
	numFrozenColumns: number;
	position: LoomMenuPosition;
	column: Column;
	closeRequest: LoomMenuCloseRequest | null;
	numColumns: number;
	onColumnChange: ColumnChangeHandler;
	onColumnTypeChange: (columnId: string, type: CellType) => void;
	onColumnDeleteClick: (columnId: string) => void;
	onFrozenColumnsChange: (value: number) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	index,
	isOpen,
	numSources,
	column,
	id,
	position,
	numFrozenColumns,
	frontmatterKeys,
	canDeleteColumn,
	closeRequest,
	onColumnDeleteClick,
	onClose,
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
		hour12,
		dateFormatSeparator,
		verticalPadding,
		horizontalPadding,
		shouldWrapOverflow,
		numberFormat,
		currencyType,
		numberPrefix,
		numberSeparator,
		numberSuffix,
		frontmatterKey,
	} = column;
	const [submenu, setSubmenu] = React.useState<SubmenuType | null>(null);
	const [localValue, setLocalValue] = React.useState(content);

	const saveLocalValue = React.useCallback(() => {
		if (localValue !== content)
			onColumnChange(columnId, { content: localValue });
	}, [columnId, content, localValue, onColumnChange]);

	React.useEffect(() => {
		if (closeRequest !== null) {
			saveLocalValue();
			onClose();
		}
	}, [
		content,
		columnId,
		closeRequest,
		saveLocalValue,
		submenu,
		localValue,
		onColumnChange,
		onClose,
	]);

	function handleWrapOverflowToggle() {
		onColumnChange(columnId, { shouldWrapOverflow: !shouldWrapOverflow });
	}

	function handleSortClick(sortDir: SortDir) {
		onColumnChange(columnId, { sortDir }, { shouldSortRows: true });
		saveLocalValue();
		onClose();
	}

	function handleAspectRatioClick(value: AspectRatio) {
		onColumnChange(columnId, { aspectRatio: value });
		saveLocalValue();
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleHorizontalPaddingClick(value: PaddingSize) {
		onColumnChange(columnId, { horizontalPadding: value });
		saveLocalValue();
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleVerticalPaddingClick(value: PaddingSize) {
		onColumnChange(columnId, { verticalPadding: value });
		saveLocalValue();
		onClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleTypeClick(type: CellType) {
		onColumnTypeChange(columnId, type);
		saveLocalValue();
		onClose();
		setSubmenu(null);
	}

	function handleFrozenColumnsChange(value: number) {
		onFrozenColumnsChange(value);
		saveLocalValue();
		onClose();
		setSubmenu(null);
	}

	function handleHideClick() {
		onColumnChange(columnId, { isVisible: false });
		saveLocalValue();
		onClose();
		setSubmenu(null);
	}

	function handleDeleteClick() {
		onColumnDeleteClick(columnId);
		saveLocalValue();
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

	function handleDateFormatSeparatorClick(value: DateFormatSeparator) {
		onColumnChange(columnId, { dateFormatSeparator: value });
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleTimeFormatClick(value: boolean) {
		onColumnChange(columnId, { hour12: value });
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleFrontmatterKeyChange(frontmatterKey: string | null) {
		onColumnChange(
			columnId,
			{
				frontmatterKey,
			},
			{
				shouldSaveFrontmatter: false,
			}
		);
		if (frontmatterKey !== null) {
			onClose();
		}
	}

	return (
		<Menu isOpen={isOpen} id={id} position={position} width={190}>
			<div className="dataloom-header-menu">
				{submenu === null && (
					<BaseSubmenu
						index={index}
						numSources={numSources}
						canDeleteColumn={canDeleteColumn}
						shouldWrapOverflow={shouldWrapOverflow}
						numFrozenColumns={numFrozenColumns}
						frontmatterKey={frontmatterKey}
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
						hour12={hour12}
						horizontalPadding={horizontalPadding}
						verticalPadding={verticalPadding}
						dateFormatSeparator={dateFormatSeparator}
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
						title="Date format"
						value={dateFormat}
						onValueClick={handleDateFormatClick}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.DATE_FORMAT_SEPARATOR && (
					<DateFormatSeparatorSubmenu
						title="Date separator"
						value={dateFormatSeparator}
						onValueClick={handleDateFormatSeparatorClick}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TIME_FORMAT && (
					<TimeFormatSubmenu
						title="Time format"
						value={hour12}
						onValueClick={handleTimeFormatClick}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.CURRENCY && (
					<NumberFormatSubmenu
						title="Number format"
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
						onValueChange={handleNumberOptionChange}
						onClose={onClose}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TEXT_INPUT_NUMBER_SUFFIX && (
					<TextInputSubmenu
						title="Suffix"
						closeRequest={closeRequest}
						value={numberSuffix}
						onClose={onClose}
						onValueChange={handleNumberOptionChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.TEXT_INPUT_NUMBER_SEPARATOR && (
					<TextInputSubmenu
						title="Separator"
						closeRequest={closeRequest}
						value={numberSeparator}
						onClose={onClose}
						onValueChange={handleNumberOptionChange}
						onBackClick={() => setSubmenu(SubmenuType.OPTIONS)}
					/>
				)}
				{submenu === SubmenuType.FRONTMATTER_KEY && (
					<FrontmatterKeySubmenu
						title="Frontmatter key"
						selectedKey={frontmatterKey}
						frontmatterKeys={frontmatterKeys}
						onFrontmatterKeyChange={handleFrontmatterKeyChange}
						onBackClick={() => setSubmenu(null)}
					/>
				)}
			</div>
		</Menu>
	);
}
