import { useState } from "react";

import Menu from "src/components/Menu";
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
} from "src/services/tableState/types";
import { SubmenuType } from "./types";

import "./styles.css";
interface Props {
	isOpen: boolean;
	canDeleteColumn: boolean;
	top: number;
	left: number;
	id: string;
	dateFormat: DateFormat;
	currencyType: CurrencyType;
	rowId: string;
	isMenuVisible: boolean;
	cellId: string;
	markdown: string;
	shouldWrapOverflow: boolean;
	columnSortDir: SortDir;
	columnType: CellType;
	columnId: string;
	numColumns: number;
	onTypeSelect: (columnId: string, type: CellType) => void;
	onSortClick: (columnId: string, sortDir: SortDir) => void;
	onDeleteClick: (columnId: string) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onNameChange: (cellId: string, value: string) => void;
	onCurrencyChange: (columnId: string, value: CurrencyType) => void;
	onDateFormatChange: (columnId: string, value: DateFormat) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	isOpen,
	id,
	isMenuVisible,
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
	shouldWrapOverflow,
	onTypeSelect,
	onSortClick,
	onDeleteClick,
	onClose,
	onWrapOverflowToggle,
	onNameChange,
	onCurrencyChange,
	onDateFormatChange,
}: Props) {
	const [submenu, setSubmenu] = useState<SubmenuType | null>(null);

	function handleSortClick(sortDir: SortDir) {
		onSortClick(columnId, sortDir);
		onClose();
	}

	function handleTypeClick(type: CellType) {
		onTypeSelect(columnId, type);
		onClose();
		setSubmenu(null);
	}

	function handleDeleteClick() {
		if (!window.confirm("Are you sure you want to delete this column?"))
			return;
		onDeleteClick(columnId);
		onClose();
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
		<Menu isOpen={isOpen} id={id} top={top} left={left} width={175}>
			<div className="NLT__header-menu">
				{submenu === null && (
					<BaseMenu
						isMenuVisible={isMenuVisible}
						cellId={cellId}
						columnName={markdown}
						columnType={columnType}
						columnSortDir={columnSortDir}
						onColumnNameChange={onNameChange}
						onSortClick={handleSortClick}
						onSubmenuChange={setSubmenu}
					/>
				)}
				{submenu === SubmenuType.OPTIONS && (
					<OptionSubmenu
						canDeleteColumn={canDeleteColumn}
						title="Options"
						type={columnType}
						columnId={columnId}
						dateFormat={dateFormat}
						currencyType={currencyType}
						shouldWrapOverflow={shouldWrapOverflow}
						onBackClick={() => setSubmenu(null)}
						onWrapOverflowToggle={onWrapOverflowToggle}
						onSubmenuChange={setSubmenu}
						onDeleteClick={handleDeleteClick}
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
}
