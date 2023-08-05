import React, { useState } from "react";

import Menu from "src/react/shared/menu";
import OptionSubmenu from "./option-submenu";
import TypeSubmenu from "./type-submenu";
import BaseMenu from "./base-menu";
import CurrencySubmenu from "./currency-submenu";
import DateFormatSubmenu from "./date-format-submenu";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
	PaddingSize,
} from "src/shared/loom-state/types";
import { SubmenuType } from "./types";

import { MenuCloseRequest } from "src/shared/menu/types";
import { useCompare } from "src/shared/hooks";
import { css } from "@emotion/react";
import AspectRatioSubmenu from "./aspect-ratio-submenu";
import PaddingSubmenu from "./padding-submenu";

interface Props {
	isOpen: boolean;
	canDeleteColumn: boolean;
	top: number;
	left: number;
	id: string;
	dateFormat: DateFormat;
	currencyType: CurrencyType;
	rowId: string;
	cellId: string;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
	markdown: string;
	shouldWrapOverflow: boolean;
	columnSortDir: SortDir;
	columnType: CellType;
	menuCloseRequest: MenuCloseRequest | null;
	columnId: string;
	numColumns: number;
	onTypeSelect: (columnId: string, type: CellType) => void;
	onSortClick: (columnId: string, sortDir: SortDir) => void;
	onDeleteClick: (columnId: string) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onNameChange: (cellId: string, value: string) => void;
	onCurrencyChange: (columnId: string, value: CurrencyType) => void;
	onDateFormatChange: (columnId: string, value: DateFormat) => void;
	onAspectRatioClick: (columnId: string, value: AspectRatio) => void;
	onHorizontalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onVerticalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onMenuClose: () => void;
	onHideClick: (columnId: string) => void;
}

const HeaderMenu = React.forwardRef<HTMLDivElement, Props>(function HeaderMenu(
	{
		isOpen,
		id,
		top,
		left,
		cellId,
		markdown,
		dateFormat,
		currencyType,
		horizontalPadding,
		verticalPadding,
		aspectRatio,
		canDeleteColumn,
		columnType,
		columnSortDir,
		columnId,
		menuCloseRequest,
		shouldWrapOverflow,
		onTypeSelect,
		onVerticalPaddingClick,
		onHorizontalPaddingClick,
		onAspectRatioClick,
		onSortClick,
		onDeleteClick,
		onMenuClose,
		onWrapOverflowToggle,
		onNameChange,
		onCurrencyChange,
		onDateFormatChange,
		onHideClick,
	}: Props,
	ref
) {
	const [submenu, setSubmenu] = useState<SubmenuType | null>(null);
	const [localValue, setLocalValue] = useState(markdown);

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);

	React.useEffect(() => {
		if (hasCloseRequestTimeChanged && menuCloseRequest !== null) {
			//If we're on the base menu
			if (submenu === null) {
				if (localValue !== markdown) onNameChange(cellId, localValue);
			}
			onMenuClose();
		}
	}, [
		markdown,
		cellId,
		hasCloseRequestTimeChanged,
		menuCloseRequest,
		submenu,
		localValue,
		onNameChange,
		onMenuClose,
	]);

	function handleSortClick(sortDir: SortDir) {
		onSortClick(columnId, sortDir);
		onMenuClose();
	}

	function handleAspectRatioClick(value: AspectRatio) {
		onAspectRatioClick(columnId, value);
		onMenuClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleHorizontalPaddingClick(value: PaddingSize) {
		onHorizontalPaddingClick(columnId, value);
		onMenuClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleVerticalPaddingClick(value: PaddingSize) {
		onVerticalPaddingClick(columnId, value);
		onMenuClose();
		setSubmenu(SubmenuType.OPTIONS);
	}

	function handleTypeClick(type: CellType) {
		onTypeSelect(columnId, type);
		onMenuClose();
		setSubmenu(null);
	}

	function handleHideClick() {
		onHideClick(columnId);
		onMenuClose();
		setSubmenu(null);
	}

	function handleDeleteClick() {
		onDeleteClick(columnId);
		onMenuClose();
		setSubmenu(null);
	}

	function handleCurrencyClick(value: CurrencyType) {
		onCurrencyChange(columnId, value);
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
			top={top}
			left={left}
			ref={ref}
			width={175}
		>
			<div
				className="dataloom-header-menu"
				css={css`
					color: var(--text-normal);
				`}
			>
				{submenu === null && (
					<BaseMenu
						canDeleteColumn={canDeleteColumn}
						cellId={cellId}
						shouldWrapOverflow={shouldWrapOverflow}
						columnId={columnId}
						columnName={localValue}
						columnType={columnType}
						menuCloseRequest={menuCloseRequest}
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
			</div>
		</Menu>
	);
});

export default HeaderMenu;
