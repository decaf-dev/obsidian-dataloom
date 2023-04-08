import React, { useRef } from "react";

import { CSS_MEASUREMENT_PIXEL_REGEX } from "src/services/string/regex";
import { numToPx, pxToNum } from "src/services/string/conversion";
import { CellType, CurrencyType, SortDir } from "src/services/tableState/types";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { MIN_COLUMN_WIDTH } from "src/services/tableState/constants";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import {
	openMenu,
	closeTopLevelMenu,
	isMenuOpen,
} from "src/services/menu/menuSlice";

import "./styles.css";
import Icon from "../Icon";
import Stack from "../Stack";
import HeaderMenu from "./components/HeaderMenu";
import { getIconTypeFromCellType } from "src/services/icon/utils";

interface Props {
	cellId: string;
	currencyType: CurrencyType;
	rowId: string;
	columnId: string;
	width: string;
	numColumns: number;
	markdown: string;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
	sortDir: SortDir;
	type: CellType;
	onSortClick: (columnId: string, sortDir: SortDir) => void;
	onTypeSelect: (columnId: string, type: CellType) => void;
	onDeleteClick: (columnId: string) => void;
	onWidthChange: (columnId: string, width: string) => void;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onNameChange: (cellId: string, rowId: string, value: string) => void;
	onCurrencyChange: (columnId: string, value: CurrencyType) => void;
}

export default function HeaderCell({
	cellId,
	rowId,
	columnId,
	currencyType,
	width,
	markdown,
	hasAutoWidth,
	shouldWrapOverflow,
	type,
	sortDir,
	numColumns,
	onWidthChange,
	onSortClick,
	onTypeSelect,
	onDeleteClick,
	onWrapOverflowToggle,
	onAutoWidthToggle,
	onNameChange,
	onCurrencyChange,
}: Props) {
	const mouseDownX = useRef(0);
	const isResizing = useRef(false);

	const menu = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu.id));

	function handleHeaderClick(e: React.MouseEvent) {
		//If we're clicking in the submenu, then don't close the menu
		const el = e.target as HTMLElement;
		if (el.closest(`#${menu.id}`)) return;

		if (isResizing.current) return;
		if (isOpen) {
			closeHeaderMenu();
		} else {
			openHeaderMenu();
		}
	}

	function openHeaderMenu() {
		dispatch(
			openMenu({
				id: menu.id,
				level: menu.level,
			})
		);
	}

	function closeHeaderMenu() {
		dispatch(closeTopLevelMenu());
	}

	function handleMouseDown(e: React.MouseEvent) {
		mouseDownX.current = e.pageX;
		isResizing.current = true;
	}

	function handleMouseMove(e: MouseEvent) {
		if (width.match(CSS_MEASUREMENT_PIXEL_REGEX)) {
			const oldWidth = pxToNum(width);
			const dist = e.pageX - mouseDownX.current;
			const newWidth = oldWidth + dist;

			if (newWidth < MIN_COLUMN_WIDTH) return;
			onWidthChange(columnId, numToPx(newWidth));
		}
	}

	function handleMouseUp() {
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
		setTimeout(() => {
			isResizing.current = false;
		}, 100);
	}

	const { top, left } = menu.position;
	const iconType = getIconTypeFromCellType(type);

	return (
		<div
			className="NLT__th-container NLT__selectable"
			ref={menu.containerRef}
			onClick={handleHeaderClick}
			style={{
				width,
			}}
		>
			<HeaderMenu
				isOpen={isOpen}
				top={top}
				left={left}
				id={menu.id}
				rowId={rowId}
				currencyType={currencyType}
				canDeleteColumn={numColumns > 1}
				columnId={columnId}
				cellId={cellId}
				shouldWrapOverflow={shouldWrapOverflow}
				hasAutoWidth={hasAutoWidth}
				markdown={markdown}
				columnSortDir={sortDir}
				columnType={type}
				numColumns={numColumns}
				onSortClick={onSortClick}
				onTypeSelect={onTypeSelect}
				onDeleteClick={onDeleteClick}
				onClose={closeHeaderMenu}
				onAutoWidthToggle={onAutoWidthToggle}
				onWrapOverflowToggle={onWrapOverflowToggle}
				onNameChange={onNameChange}
				onCurrencyChange={onCurrencyChange}
			/>
			<div className="NLT__th-content">
				<Stack spacing="md">
					<Icon type={iconType} size="md" />
					{markdown}
				</Stack>
			</div>
			<div className="NLT__th-resize-container">
				{!hasAutoWidth && (
					<div
						className="NLT__th-resize"
						onMouseDown={(e) => {
							closeHeaderMenu();
							//Prevents drag and drop
							//See: https://stackoverflow.com/questions/704564/disable-drag-and-drop-on-html-elements
							e.preventDefault();
							handleMouseDown(e);
							window.addEventListener(
								"mousemove",
								handleMouseMove
							);
							window.addEventListener("mouseup", handleMouseUp);
						}}
						onClick={(e) => {
							//Stop propagation so we don't open the header
							e.stopPropagation();
						}}
					/>
				)}
			</div>
		</div>
	);
}
