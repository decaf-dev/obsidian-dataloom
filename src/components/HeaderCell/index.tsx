import React from "react";

import { numToPx, pxToNum } from "src/services/string/conversion";
import {
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
} from "src/services/tableState/types";
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
import { useResizeColumn } from "./services/hooks";

interface Props {
	cellId: string;
	currencyType: CurrencyType;
	rowId: string;
	columnId: string;
	width: string;
	numColumns: number;
	dateFormat: DateFormat;
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
	onDateFormatChange: (columnId: string, value: DateFormat) => void;
}

export default function HeaderCell({
	cellId,
	rowId,
	columnId,
	currencyType,
	width,
	dateFormat,
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
	onDateFormatChange,
}: Props) {
	const menu = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu.id));

	const { resizingColumnId } = useAppSelector((state) => state.global);
	const { handleMouseDown } = useResizeColumn(columnId, (dist) => {
		const oldWidth = pxToNum(width);
		const newWidth = oldWidth + dist;

		if (newWidth < MIN_COLUMN_WIDTH) return;
		onWidthChange(columnId, numToPx(newWidth));
	});

	function handleHeaderClick(e: React.MouseEvent) {
		//If we're clicking in the submenu, then don't close the menu
		const el = e.target as HTMLElement;
		if (el.closest(`#${menu.id}`)) return;

		if (resizingColumnId !== null) return;
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

	const { top, left } = menu.position;
	const iconType = getIconTypeFromCellType(type);

	let contentClassName = "NLT__th-content";
	if (resizingColumnId == null) contentClassName += " NLT__selectable";

	let resizeClassName = "NLT__th-resize";
	if (resizingColumnId == columnId)
		resizeClassName += " NLT__th-resize--active";

	return (
		<div
			className="NLT__th-container"
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
				dateFormat={dateFormat}
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
				onDateFormatChange={onDateFormatChange}
			/>
			<div className={contentClassName}>
				<Stack spacing="md">
					<Icon type={iconType} size="md" />
					{markdown}
				</Stack>
			</div>
			<div className="NLT__th-resize-container">
				{!hasAutoWidth && (
					<div
						className={resizeClassName}
						onMouseDown={(e) => {
							closeHeaderMenu();
							handleMouseDown(e);
						}}
						onClick={(e) => {
							//Stop propagation so we don't open the header
							e.stopPropagation();
							if (e.detail === 2) {
								console.log("DOUBLE CLICK");
							}
						}}
					/>
				)}
			</div>
		</div>
	);
}
