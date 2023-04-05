import { useState } from "react";

import Menu from "src/components/Menu";
import OptionSubmenu from "./components/OptionSubmenu";
import InsertSubmenu from "./components/InsertSubmenu";
import MoveSubmenu from "./components/MoveSubmenu";
import TypeSubmenu from "./components/TypeSubmenu";
import BaseMenu from "./components/BaseMenu";

import { CellType, CurrencyType, SortDir } from "src/services/tableState/types";

import "./styles.css";
import { Submenu } from "./types";
interface Props {
	isOpen: boolean;
	canDeleteColumn: boolean;
	top: number;
	left: number;
	id: string;
	currencyType: CurrencyType;
	rowId: string;
	cellId: string;
	markdown: string;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
	columnSortDir: SortDir;
	columnType: CellType;
	columnId: string;
	columnIndex: number;
	numColumns: number;
	onInsertColumnClick: (columnId: string, insertRight: boolean) => void;
	onMoveColumnClick: (columnId: string, moveRight: boolean) => void;
	onTypeSelect: (columnId: string, type: CellType) => void;
	onSortClick: (columnId: string, sortDir: SortDir) => void;
	onDeleteClick: (columnId: string) => void;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onNameChange: (cellId: string, rowId: string, value: string) => void;
	onCurrencyChange: (columnId: string, value: CurrencyType) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	isOpen,
	id,
	rowId,
	top,
	left,
	cellId,
	markdown,
	currencyType,
	canDeleteColumn,
	columnType,
	columnSortDir,
	columnId,
	columnIndex,
	numColumns,
	hasAutoWidth,
	shouldWrapOverflow,
	onTypeSelect,
	onSortClick,
	onDeleteClick,
	onInsertColumnClick,
	onMoveColumnClick,
	onClose,
	onWrapOverflowToggle,
	onAutoWidthToggle,
	onNameChange,
	onCurrencyChange,
}: Props) {
	const [submenu, setSubmenu] = useState<Submenu | null>(null);

	function handleMoveColumnClick(moveRight: boolean) {
		onMoveColumnClick(columnId, moveRight);
		onClose();
		setSubmenu(null);
	}

	function handleSortClick(sortDir: SortDir) {
		onSortClick(columnId, sortDir);
		onClose();
	}

	function handleInsertColumnClick(insertRight: boolean) {
		onInsertColumnClick(columnId, insertRight);
		onClose();
		setSubmenu(null);
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

	function handleBackClick() {
		setSubmenu(null);
	}

	function handleCurrencyChange(value: CurrencyType) {
		onCurrencyChange(columnId, value);
	}

	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left} width={175}>
			<div className="NLT__header-menu">
				{submenu === null && (
					<BaseMenu
						rowId={rowId}
						cellId={cellId}
						columnName={markdown}
						columnType={columnType}
						numColumns={numColumns}
						columnSortDir={columnSortDir}
						onColumnNameChange={onNameChange}
						onSortClick={handleSortClick}
						onSubmenuChange={setSubmenu}
					/>
				)}
				{submenu === Submenu.OPTIONS && (
					<OptionSubmenu
						canDeleteColumn={canDeleteColumn}
						title="Options"
						columnType={columnType}
						columnId={columnId}
						columnCurrencyType={currencyType}
						hasAutoWidth={hasAutoWidth}
						shouldWrapOverflow={shouldWrapOverflow}
						onBackClick={handleBackClick}
						onAutoWidthToggle={onAutoWidthToggle}
						onWrapOverflowToggle={onWrapOverflowToggle}
						onCurrencyChange={handleCurrencyChange}
						onDeleteClick={handleDeleteClick}
					/>
				)}
				{submenu == Submenu.INSERT && (
					<InsertSubmenu
						title="Insert"
						onInsertClick={handleInsertColumnClick}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu === Submenu.MOVE && (
					<MoveSubmenu
						title="Move"
						columnIndex={columnIndex}
						numColumns={numColumns}
						onMoveClick={handleMoveColumnClick}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu === Submenu.TYPE && (
					<TypeSubmenu
						title="Type"
						columnType={columnType}
						onTypeClick={handleTypeClick}
						onBackClick={handleBackClick}
					/>
				)}
			</div>
		</Menu>
	);
}
