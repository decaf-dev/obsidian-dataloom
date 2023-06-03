import React, { useState } from "react";

import Menu from "src/react/shared/menu";
import OptionSubmenu from "./components/OptionSubmenu";
import TypeSubmenu from "./components/TypeSubmenu";
import BaseMenu from "./components/BaseMenu";
import CurrencySubmenu from "./components/CurrencySubmenu";
import DateFormatSubmenu from "./components/DateFormatSubmenu";

import {
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
} from "src/shared/types/types";
import { SubmenuType } from "./types";

import "./styles.css";
import { MenuCloseRequest } from "src/shared/menu/types";
import { useCompare } from "src/shared/hooks";

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
	onMenuClose: () => void;
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
		canDeleteColumn,
		columnType,
		columnSortDir,
		columnId,
		menuCloseRequest,
		shouldWrapOverflow,
		onTypeSelect,
		onSortClick,
		onDeleteClick,
		onMenuClose,
		onWrapOverflowToggle,
		onNameChange,
		onCurrencyChange,
		onDateFormatChange,
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
			if (submenu === null) onNameChange(cellId, localValue);
			onMenuClose();
		}
	}, [
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

	function handleTypeClick(type: CellType) {
		onTypeSelect(columnId, type);
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
			<div className="NLT__header-menu">
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
					/>
				)}
				{submenu === SubmenuType.OPTIONS && (
					<OptionSubmenu
						title="Options"
						type={columnType}
						dateFormat={dateFormat}
						currencyType={currencyType}
						onBackClick={() => setSubmenu(null)}
						onSubmenuChange={setSubmenu}
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
