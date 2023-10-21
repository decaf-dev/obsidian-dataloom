import React, { useState } from "react";

import Menu from "src/react/shared/menu";
import OptionSubmenu from "./option-submenu";
import TypeSubmenu from "./type-submenu";
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
	FrontmatterKey,
} from "src/shared/loom-state/types/loom-state";
import { SubmenuType } from "./types";

import { LoomMenuPosition } from "../../shared/menu/types";
import "./styles.css";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";
import FrontmatterKeySubmenu from "./frontmatter-key-submenu";
import { LoomMenuCloseRequest } from "src/react/shared/menu-provider/types";
import BaseSubmenu from "./base-submenu";

interface Props {
	index: number;
	numSources: number;
	isOpen: boolean;
	canDeleteColumn: boolean;
	frontmatterKeys: string[];
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
	const [submenu, setSubmenu] = useState<SubmenuType | null>(null);
	const [localValue, setLocalValue] = useState(content);

	React.useEffect(() => {
		if (closeRequest !== null) {
			//If we're on the base menu
			if (submenu === null) {
				if (localValue !== content)
					onColumnChange(columnId, { content: localValue });
			}
			onClose();
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

	function handleWrapOverflowToggle() {
		onColumnChange(columnId, { shouldWrapOverflow: !shouldWrapOverflow });
	}

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

	function handleFrontmatterKeyChange(frontmatterKey: FrontmatterKey | null) {
		onColumnChange(columnId, {
			frontmatterKey,
		});
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
						closeRequest={closeRequest}
						frontmatterKeys={frontmatterKeys}
						frontmatterKey={frontmatterKey}
						onClose={onClose}
						onFrontMatterKeyChange={handleFrontmatterKeyChange}
						onBackClick={() => setSubmenu(null)}
					/>
				)}
			</div>
		</Menu>
	);
}
