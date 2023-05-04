import React, { useEffect } from "react";

import { numToPx, pxToNum } from "src/shared/conversion";
import { CellType, CurrencyType, DateFormat, SortDir } from "src/data/types";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { MIN_COLUMN_WIDTH } from "src/shared/table-state/constants";
import { useAppDispatch, useAppSelector } from "src/redux/global/hooks";

import Icon from "../../shared/icon";
import Stack from "../../shared/stack";
import HeaderMenu from "./components/HeaderMenu";
import { useResizeColumn } from "./services/hooks";
import { useCompare, useForceUpdate } from "src/shared/hooks";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import { getIconTypeFromCellType } from "src/react/shared/icon/utils";
import "./styles.css";
import Focusable from "src/react/shared/menu-focus";
import MenuFocus from "src/react/shared/menu-focus";

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
	sortDir: SortDir;
	type: CellType;
	onSortClick: (columnId: string, sortDir: SortDir) => void;
	onTypeSelect: (columnId: string, type: CellType) => void;
	onDeleteClick: (columnId: string) => void;
	onWidthChange: (columnId: string, width: string) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onNameChange: (cellId: string, value: string) => void;
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
	shouldWrapOverflow,
	type,
	sortDir,
	numColumns,
	onWidthChange,
	onSortClick,
	onTypeSelect,
	onDeleteClick,
	onWrapOverflowToggle,
	onNameChange,
	onCurrencyChange,
	onDateFormatChange,
}: Props) {
	const {
		menu,
		menuPosition,
		isMenuOpen,
		isMenuVisible,
		closeTopLevelMenu,
		openMenu,
	} = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();
	const [updateTime, forceUpdate] = useForceUpdate();

	//A width of "unset" means that we have double clicked to resize the column
	//We need to force an update so that the menu ref will have the correct width
	useEffect(() => {
		if (width === "unset") {
			forceUpdate();
		}
	}, [width, forceUpdate]);

	//We will then need to update the width of the column so that the header cell will
	//have a value set in pixels
	const shouldUpdateWidth = useCompare(updateTime);
	useEffect(() => {
		if (shouldUpdateWidth) {
			const newWidth = numToPx(menuPosition.position.width);
			onWidthChange(columnId, newWidth);
		}
	}, [shouldUpdateWidth, menuPosition]);

	const { resizingColumnId } = useAppSelector((state) => state.global);
	const { handleMouseDown } = useResizeColumn(columnId, (dist) => {
		const oldWidth = pxToNum(width);
		const newWidth = oldWidth + dist;

		if (newWidth < MIN_COLUMN_WIDTH) return;
		onWidthChange(columnId, numToPx(newWidth));
	});

	function handleMouseUp() {
		//If we're resizing a column, then don't open the menu
		if (resizingColumnId !== null) return;

		openMenu(menu);
	}

	function closeHeaderMenu() {
		closeTopLevelMenu();
	}

	const { top, left } = shiftMenuIntoViewContent({
		menuId: menu.id,
		menuPositionEl: menuPosition.positionRef.current,
		menuPosition: menuPosition.position,
	});
	const iconType = getIconTypeFromCellType(type);

	let contentClassName = "NLT__th-content";
	if (resizingColumnId == null) contentClassName += " NLT__selectable";

	let resizeClassName = "NLT__th-resize";
	if (resizingColumnId == columnId)
		resizeClassName += " NLT__th-resize--active";

	return (
		<>
			<MenuFocus menuId={menu.id} onClick={handleMouseUp}>
				<div
					className="NLT__th-container"
					ref={menuPosition.positionRef}
					style={{
						width,
					}}
				>
					<div className={contentClassName}>
						<Stack spacing="md">
							<Icon type={iconType} size="md" />
							{markdown}
						</Stack>
					</div>
					<div className="NLT__th-resize-container">
						<div
							className={resizeClassName}
							onMouseDown={(e) => {
								closeHeaderMenu();
								handleMouseDown(e);
							}}
							onClick={(e) => {
								//Stop propagation so we don't open the header
								e.stopPropagation();

								//If the user is double clicking then set width to max
								if (e.detail === 2)
									onWidthChange(columnId, "unset");
							}}
						/>
					</div>
				</div>
			</MenuFocus>
			<HeaderMenu
				isOpen={isMenuOpen}
				isMenuVisible={isMenuVisible}
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
				markdown={markdown}
				columnSortDir={sortDir}
				columnType={type}
				numColumns={numColumns}
				onSortClick={onSortClick}
				onTypeSelect={onTypeSelect}
				onDeleteClick={onDeleteClick}
				onClose={closeHeaderMenu}
				onWrapOverflowToggle={onWrapOverflowToggle}
				onNameChange={onNameChange}
				onCurrencyChange={onCurrencyChange}
				onDateFormatChange={onDateFormatChange}
			/>
		</>
	);
}
