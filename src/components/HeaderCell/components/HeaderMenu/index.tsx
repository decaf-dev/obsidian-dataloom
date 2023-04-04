import { useState } from "react";

import Menu from "src/components/Menu";
import EditSubmenu from "./components/EditSubmenu";
import InsertSubmenu from "./components/InsertSubmenu";
import MoveSubmenu from "./components/MoveSubmenu";
import TypeSubmenu from "./components/TypeSubmenu";
import BaseMenu from "./components/BaseMenu";

import { SUBMENU_ITEM, SubmenuItem } from "./constants";

import { CellType, SortDir } from "src/services/tableState/types";

import "./styles.css";
interface Props {
	isOpen: boolean;
	canDeleteColumn: boolean;
	top: number;
	left: number;
	id: string;
	cellId: string;
	markdown: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	columnSortDir: SortDir;
	columnType: CellType;
	columnId: string;
	columnIndex: number;
	numColumns: number;
	onInsertColumnClick: (insertRight: boolean) => void;
	onMoveColumnClick: (moveRight: boolean) => void;
	onTypeSelect: (type: CellType) => void;
	onSortClick: (sortDir: SortDir) => void;
	onDeleteClick: () => void;
	onAutoWidthToggle: (value: boolean) => void;
	onWrapOverflowToggle: (value: boolean) => void;
	onNameChange: (value: string) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	isOpen,
	id,
	top,
	left,
	markdown,
	canDeleteColumn,
	columnType,
	columnSortDir,
	columnId,
	columnIndex,
	numColumns,
	useAutoWidth,
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
}: Props) {
	const [submenu, setSubmenu] = useState<SubmenuItem | null>(null);

	function handleMoveColumnClick(moveRight: boolean) {
		onMoveColumnClick(moveRight);
		onClose();
		setSubmenu(null);
	}

	function handleSortClick(sortDir: SortDir) {
		onSortClick(sortDir);
		onClose();
	}

	function handleInsertColumnClick(insertRight: boolean) {
		onInsertColumnClick(insertRight);
		onClose();
		setSubmenu(null);
	}

	function handleTypeClick(type: CellType) {
		onTypeSelect(type);
		onClose();
		setSubmenu(null);
	}

	function handleDeleteClick() {
		onDeleteClick();
		onClose();
		setSubmenu(null);
	}

	function handleBackClick() {
		setSubmenu(null);
	}

	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left} width={175}>
			<div className="NLT__header-menu">
				{submenu === null && (
					<BaseMenu
						columnName={markdown}
						columnType={columnType}
						numColumns={numColumns}
						columnSortDir={columnSortDir}
						onColumnNameChange={onNameChange}
						onSortClick={handleSortClick}
						onSubmenuChange={setSubmenu}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.EDIT.name && (
					<EditSubmenu
						canDeleteColumn={canDeleteColumn}
						title={submenu.content}
						columnType={columnType}
						columnId={columnId}
						useAutoWidth={useAutoWidth}
						shouldWrapOverflow={shouldWrapOverflow}
						onBackClick={handleBackClick}
						onAutoWidthToggle={onAutoWidthToggle}
						onWrapOverflowToggle={onWrapOverflowToggle}
						onDeleteClick={handleDeleteClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.INSERT.name && (
					<InsertSubmenu
						title={submenu.content}
						onInsertClick={handleInsertColumnClick}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.MOVE.name && (
					<MoveSubmenu
						title={submenu.content}
						columnIndex={columnIndex}
						numColumns={numColumns}
						onMoveClick={handleMoveColumnClick}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.TYPE.name && (
					<TypeSubmenu
						title={submenu.content}
						columnType={columnType}
						onTypeClick={handleTypeClick}
						onBackClick={handleBackClick}
					/>
				)}
			</div>
		</Menu>
	);
}
