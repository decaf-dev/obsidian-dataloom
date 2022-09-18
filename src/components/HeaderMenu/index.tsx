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
	style: {
		top: string;
		left: string;
	};
	id: string;
	cellId: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	columnSortDir: SortDir;
	columnName: string;
	columnType: string;
	columnIndex: number;
	numColumns: number;
	onInsertColumnClick: (columnIndex: number, insertRight: boolean) => void;
	onMoveColumnClick: (columnIndex: number, moveRight: boolean) => void;
	onTypeSelect: (cellId: string, columnIndex: number, type: CellType) => void;
	onSortSelect: (columnIndex: number, sortDir: SortDir) => void;
	onDeleteClick: (columnIndex: number) => void;
	onOutsideClick: (cellId: string, inputText: string) => void;
	onAutoWidthToggle: (columnIndex: number, value: boolean) => void;
	onWrapOverflowToggle: (columnIndex: number, value: boolean) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	isOpen,
	id,
	cellId,
	columnName,
	columnType,
	columnSortDir,
	columnIndex,
	numColumns,
	style,
	useAutoWidth,
	shouldWrapOverflow,
	onTypeSelect,
	onSortSelect,
	onDeleteClick,
	onOutsideClick,
	onInsertColumnClick,
	onMoveColumnClick,
	onClose,
	onWrapOverflowToggle,
	onAutoWidthToggle,
}: Props) {
	const [headerNameInput, setHeaderNameInput] = useState("");
	const [submenu, setSubmenu] = useState(null);
	const lastLength = useRef(0);

	useEffect(() => {
		if (!isOpen) {
			//If we're in Live Preview mode and we click on the header and then click on the outside of
			//the component, the header will close, set the data (which didn't change), which cause an update
			//which persists the data again. We can prevent this by only calling onOutsideClick
			//if the data has actually changed
			if (headerNameInput.length !== lastLength.current) {
				lastLength.current = headerNameInput.length;
				if (headerNameInput !== columnName) {
					onOutsideClick(cellId, headerNameInput);
				}
			}
			setSubmenu(null);
		}
	}, [isOpen, headerNameInput.length, lastLength.current]);

	useEffect(() => {
		setHeaderNameInput(columnName);
	}, [columnName]);

	function handleMoveColumnClick(columnIndex: number, moveRight: boolean) {
		onMoveColumnClick(columnIndex, moveRight);
		onClose();
	}

	function handleSortClick(columnIndex: number, sortDir: SortDir) {
		onSortSelect(columnIndex, sortDir);
		onClose();
	}

	function handleInsertColumnClick(
		columnIndex: number,
		insertRight: boolean
	) {
		onInsertColumnClick(columnIndex, insertRight);
		onClose();
	}

	function handleTypeClick(
		cellId: string,
		columnIndex: number,
		type: CellType
	) {
		onTypeSelect(cellId, columnIndex, type);
		onClose();
	}

	function handleDeleteClick(columnIndex: number) {
		if (window.confirm("Are you sure you want to delete this column?")) {
			onDeleteClick(columnIndex);
			onClose();
		}
	}

	function handleBackClick() {
		setSubmenu(null);
	}

	return (
		<Menu isOpen={isOpen} id={id} style={style}>
			<div className="NLT__header-menu">
				{submenu === null && (
					<SubmenuList
						numColumns={numColumns}
						onOptionClick={setSubmenu}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.EDIT.name && (
					<EditSubmenu
						title={submenu.content}
						columnName={headerNameInput}
						columnType={columnType}
						columnIndex={columnIndex}
						useAutoWidth={useAutoWidth}
						shouldWrapOverflow={shouldWrapOverflow}
						onBackClick={handleBackClick}
						onAutoWidthToggle={onAutoWidthToggle}
						onWrapOverflowToggle={onWrapOverflowToggle}
						onDeleteClick={handleDeleteClick}
						onNameChange={setHeaderNameInput}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.INSERT.name && (
					<InsertSubmenu
						title={submenu.content}
						onInsertClick={(isRightInsert) =>
							handleInsertColumnClick(columnIndex, isRightInsert)
						}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.SORT.name && (
					<SortSubmenu
						title={submenu.content}
						columnSortDir={columnSortDir}
						onSortClick={(sortDir) =>
							handleSortClick(columnIndex, sortDir)
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
							handleMoveColumnClick(columnIndex, isRightMove)
						}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.TYPE.name && (
					<TypeSubmenu
						title={submenu.content}
						columnType={columnType}
						onTypeClick={(type) =>
							handleTypeClick(cellId, columnIndex, type)
						}
						onBackClick={handleBackClick}
					/>
				)}
			</div>
		</Menu>
	);
}
