import React, { useEffect, useState, useRef } from "react";

import Menu from "../Menu";
import MenuItem from "./components/MenuItem";
import EditSubmenu from "./components/EditSubmenu";
import SortSubmenu from "./components/SortSubmenu";
import InsertSubmenu from "./components/InsertSubmenu";
import MoveSubmenu from "./components/MoveSubmenu";
import TypeSubmenu from "./components/TypeSubmenu";

import { SortDir } from "src/services/sort/types";
import { SUBMENU_ITEM, SubmenuItem } from "./constants";

import "./styles.css";
import { CellType } from "src/services/table/types";

interface SubMenuListProps {
	numColumns: number;
	onOptionClick: (item: SubmenuItem) => void;
}

const SubmenuList = ({ numColumns, onOptionClick }: SubMenuListProps) => {
	return (
		<>
			{Object.values(SUBMENU_ITEM)
				.filter((value) => {
					if (
						numColumns === 1 &&
						value.name === SUBMENU_ITEM.MOVE.name
					)
						return false;
					return true;
				})
				.map((item) => (
					<MenuItem
						key={item.name}
						content={item.content}
						icon={item.icon}
						onClick={() => onOptionClick(item)}
					/>
				))}
		</>
	);
};

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
	columnType: string;
	columnId: string;
	columnIndex: number;
	numColumns: number;
	onInsertColumnClick: (columnId: string, insertRight: boolean) => void;
	onMoveColumnClick: (columnId: string, moveRight: boolean) => void;
	onTypeSelect: (columnId: string, type: CellType) => void;
	onSortSelect: (columnId: string, sortDir: SortDir) => void;
	onDeleteClick: (columnId: string) => void;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onNameChange: (columnId: string, value: string) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	isOpen,
	cellId,
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
	onSortSelect,
	onDeleteClick,
	onInsertColumnClick,
	onMoveColumnClick,
	onClose,
	onWrapOverflowToggle,
	onAutoWidthToggle,
	onNameChange,
}: Props) {
	const [submenu, setSubmenu] = useState(null);

	function handleMoveColumnClick(columnId: string, moveRight: boolean) {
		onMoveColumnClick(columnId, moveRight);
		onClose();
		setSubmenu(null);
	}

	function handleSortClick(columnId: string, sortDir: SortDir) {
		onSortSelect(columnId, sortDir);
		onClose();
		setSubmenu(null);
	}

	function handleInsertColumnClick(columnId: string, insertRight: boolean) {
		onInsertColumnClick(columnId, insertRight);
		onClose();
		setSubmenu(null);
	}

	function handleTypeClick(columnId: string, type: CellType) {
		onTypeSelect(columnId, type);
		onClose();
		setSubmenu(null);
	}

	function handleDeleteClick(columnId: string) {
		if (window.confirm("Are you sure you want to delete this column?")) {
			onDeleteClick(columnId);
			onClose();
			setSubmenu(null);
		}
	}

	function handleBackClick() {
		setSubmenu(null);
	}

	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left} maxWidth={175}>
			<div className="NLT__header-menu">
				{submenu === null && (
					<SubmenuList
						numColumns={numColumns}
						onOptionClick={setSubmenu}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.EDIT.name && (
					<EditSubmenu
						canDeleteColumn={canDeleteColumn}
						cellId={cellId}
						title={submenu.content}
						markdown={markdown}
						columnType={columnType}
						columnId={columnId}
						useAutoWidth={useAutoWidth}
						shouldWrapOverflow={shouldWrapOverflow}
						onBackClick={handleBackClick}
						onAutoWidthToggle={onAutoWidthToggle}
						onWrapOverflowToggle={onWrapOverflowToggle}
						onDeleteClick={handleDeleteClick}
						onNameChange={onNameChange}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.INSERT.name && (
					<InsertSubmenu
						title={submenu.content}
						onInsertClick={(isRightInsert) =>
							handleInsertColumnClick(columnId, isRightInsert)
						}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.SORT.name && (
					<SortSubmenu
						title={submenu.content}
						columnSortDir={columnSortDir}
						onSortClick={(sortDir) =>
							handleSortClick(columnId, sortDir)
						}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.MOVE.name && (
					<MoveSubmenu
						title={submenu.content}
						columnIndex={columnIndex}
						numColumns={numColumns}
						onMoveClick={(isRightMove) =>
							handleMoveColumnClick(columnId, isRightMove)
						}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.TYPE.name && (
					<TypeSubmenu
						title={submenu.content}
						columnType={columnType}
						onTypeClick={(type) => handleTypeClick(columnId, type)}
						onBackClick={handleBackClick}
					/>
				)}
			</div>
		</Menu>
	);
}
