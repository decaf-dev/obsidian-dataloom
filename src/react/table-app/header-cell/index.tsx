import React from "react";

import { numToPx } from "src/shared/conversion";
import {
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
} from "src/shared/types/types";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { useAppSelector } from "src/redux/global/hooks";

import Icon from "../../shared/icon";
import Stack from "../../shared/stack";
import HeaderMenu from "./components/HeaderMenu";
import { useCompare, useForceUpdate } from "src/shared/hooks";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { getIconIdForCellType } from "src/react/shared/icon/utils";
import MenuTrigger from "src/react/shared/menu-trigger";
import ResizeContainer from "./resize-container";

import { css } from "@emotion/react";

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
	const { menu, isMenuOpen, closeTopMenu, menuRef, openMenu } = useMenu(
		MenuLevel.ONE
	);
	const { triggerPosition, triggerRef } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen);

	const { resizingColumnId } = useAppSelector((state) => state.global);

	const [forceUpdateTime, forceUpdate] = useForceUpdate();

	//A width of "unset" means that we have double clicked to fore the column to resize
	//to the width of the cell contents
	//We need to force an update so that the menu ref will have the correct width
	React.useEffect(() => {
		if (width === "unset") forceUpdate();
	}, [width, forceUpdate]);

	//We will then need to update the width of the column so that the header cell will
	//have a value set in pixels
	const shouldUpdateWidth = useCompare(forceUpdateTime);
	React.useEffect(() => {
		if (shouldUpdateWidth) {
			const newWidth = numToPx(triggerPosition.width);
			onWidthChange(columnId, newWidth);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnId, shouldUpdateWidth, triggerPosition]);

	function handleMenuTriggerClick() {
		//If we're resizing a column, then don't open the menu
		if (resizingColumnId !== null) return;
		if (isMenuOpen) {
			closeTopMenu();
		} else {
			openMenu(menu);
		}
	}

	const lucideId = getIconIdForCellType(type);

	let contentClassName = "NLT__th-content";
	if (resizingColumnId == null) contentClassName += " NLT__selectable";

	return (
		<>
			<MenuTrigger menuId={menu.id} onClick={handleMenuTriggerClick}>
				<div
					className="NLT__th-container"
					ref={triggerRef}
					css={css`
						display: flex;
						justify-content: space-between;
						min-height: var(--nlt-cell-min-height);
						width: ${width};
					`}
				>
					<div
						className={contentClassName}
						css={css`
							display: flex;
							align-items: center;
							/* Use 100% so that the resize indicator appears at the end */
							width: 100%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							user-select: none;
							padding: var(--nlt-cell-spacing-x)
								var(--nlt-cell-spacing-y);
						`}
					>
						<Stack spacing="md" align="flex-start">
							<Icon lucideId={lucideId} size="md" />
							{markdown}
						</Stack>
					</div>
					<ResizeContainer
						currentResizingId={resizingColumnId}
						columnId={columnId}
						width={width}
						onWidthChange={onWidthChange}
						onMenuClose={() => closeTopMenu(false)}
					/>
				</div>
			</MenuTrigger>
			<HeaderMenu
				isOpen={isMenuOpen}
				top={triggerPosition.top}
				left={triggerPosition.left}
				id={menu.id}
				ref={menuRef}
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
				onClose={() => closeTopMenu()}
				onWrapOverflowToggle={onWrapOverflowToggle}
				onNameChange={onNameChange}
				onCurrencyChange={onCurrencyChange}
				onDateFormatChange={onDateFormatChange}
			/>
		</>
	);
}
