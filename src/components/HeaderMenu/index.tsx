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
import { CellType } from "src/services/appData/state/types";

interface Props {
	isOpen: boolean;
	style: {
		top: string;
		left: string;
	};
	headerId: string;
	id: string;
	index: number;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	headerSortDir: SortDir;
	headerName: string;
	headerType: string;
	headerIndex: number;
	numHeaders: number;
	onInsertColumnClick: (id: string, insertRight: boolean) => void;
	onMoveColumnClick: (id: string, moveRight: boolean) => void;
	onTypeSelect: (id: string, type: CellType) => void;
	onSortSelect: (id: string, sortDir: SortDir) => void;
	onHeaderDeleteClick: (id: string) => void;
	onOutsideClick: (id: string, inputText: string) => void;
	onAutoWidthToggle: (id: string, value: boolean) => void;
	onWrapOverflowToggle: (id: string, value: boolean) => void;
	onClose: () => void;
}

interface SubMenuListProps {
	numHeaders: number;
	onOptionClick: (item: SubmenuItem) => void;
}

const SubmenuList = ({ numHeaders, onOptionClick }: SubMenuListProps) => {
	return (
		<>
			{Object.values(SUBMENU_ITEM)
				.filter((value) => {
					if (
						numHeaders === 1 &&
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

export default function HeaderMenu({
	isOpen,
	id,
	headerId,
	headerName,
	headerType,
	headerSortDir,
	headerIndex,
	numHeaders,
	style,
	useAutoWidth,
	shouldWrapOverflow,
	onTypeSelect,
	onSortSelect,
	onHeaderDeleteClick,
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
				if (headerNameInput !== headerName) {
					onOutsideClick(headerId, headerNameInput);
				}
			}
			setSubmenu(null);
		}
	}, [isOpen, headerNameInput.length, lastLength.current]);

	useEffect(() => {
		setHeaderNameInput(headerName);
	}, [headerName]);

	function handleMoveColumnClick(id: string, moveRight: boolean) {
		onMoveColumnClick(id, moveRight);
		onClose();
	}

	function handleSortClick(id: string, sortDir: SortDir) {
		onSortSelect(id, sortDir);
		onClose();
	}

	function handleInsertColumnClick(id: string, insertRight: boolean) {
		onInsertColumnClick(id, insertRight);
		onClose();
	}

	function handleTypeClick(id: string, type: CellType) {
		onTypeSelect(id, type);
		onClose();
	}

	function handleHeaderDeleteClick(id: string) {
		if (window.confirm("Are you sure you want to delete this column?")) {
			onHeaderDeleteClick(id);
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
						numHeaders={numHeaders}
						onOptionClick={setSubmenu}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.EDIT.name && (
					<EditSubmenu
						title={submenu.content}
						headerId={headerId}
						headerName={headerNameInput}
						headerType={headerType}
						useAutoWidth={useAutoWidth}
						shouldWrapOverflow={shouldWrapOverflow}
						onBackClick={handleBackClick}
						onAutoWidthToggle={onAutoWidthToggle}
						onWrapOverflowToggle={onWrapOverflowToggle}
						onHeaderDeleteClick={handleHeaderDeleteClick}
						onHeaderNameChange={setHeaderNameInput}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.INSERT.name && (
					<InsertSubmenu
						title={submenu.content}
						onInsertClick={(isRightInsert) =>
							handleInsertColumnClick(headerId, isRightInsert)
						}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.SORT.name && (
					<SortSubmenu
						title={submenu.content}
						headerSortDir={headerSortDir}
						onSortClick={(sortDir) =>
							handleSortClick(headerId, sortDir)
						}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.MOVE.name && (
					<MoveSubmenu
						title={submenu.content}
						headerIndex={headerIndex}
						numHeaders={numHeaders}
						onMoveClick={(isRightMove) =>
							handleMoveColumnClick(headerId, isRightMove)
						}
						onBackClick={handleBackClick}
					/>
				)}
				{submenu && submenu.name === SUBMENU_ITEM.TYPE.name && (
					<TypeSubmenu
						title={submenu.content}
						headerType={headerType}
						onTypeClick={(type) => handleTypeClick(headerId, type)}
						onBackClick={handleBackClick}
					/>
				)}
			</div>
		</Menu>
	);
}
