import React from "react";

import { numToPx } from "src/shared/conversion";
import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	PaddingSize,
	SortDir,
} from "src/shared/types";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";

import Icon from "../../shared/icon";
import Stack from "../../shared/stack";
import { useCompare, useForceUpdate } from "src/shared/hooks";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { getIconIdForCellType } from "src/react/shared/icon/utils";
import MenuTrigger from "src/react/shared/menu-trigger";
import ResizeContainer from "./resize-container";

import { css } from "@emotion/react";
import HeaderMenu from "../header-cell-edit";

interface Props {
	cellId: string;
	currencyType: CurrencyType;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
	aspectRatio: AspectRatio;
	rowId: string;
	columnId: string;
	width: string;
	resizingColumnId: string | null;
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
	onVerticalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onHorizontalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onAspectRatioClick: (columnId: string, value: AspectRatio) => void;
	onHideClick: (columnId: string) => void;
}

export default function HeaderCell({
	cellId,
	rowId,
	columnId,
	currencyType,
	width,
	dateFormat,
	horizontalPadding,
	verticalPadding,
	aspectRatio,
	markdown,
	shouldWrapOverflow,
	resizingColumnId,
	type,
	sortDir,
	numColumns,
	onWidthChange,
	onSortClick,
	onTypeSelect,
	onVerticalPaddingClick,
	onHorizontalPaddingClick,
	onAspectRatioClick,
	onDeleteClick,
	onWrapOverflowToggle,
	onNameChange,
	onCurrencyChange,
	onDateFormatChange,
	onHideClick,
}: Props) {
	const { menu, isMenuOpen, closeTopMenu, menuRef, menuCloseRequest } =
		useMenu(MenuLevel.ONE, { shouldRequestOnClose: true });
	const { triggerPosition, triggerRef } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen);

	const [forceUpdateTime, forceUpdate] = useForceUpdate();

	//A width of "unset" means that we have double clicked to fore the column to resize
	//to the width of the cell contents
	//We need to force an update so that the menu ref will have the correct width
	React.useEffect(() => {
		if (width === "unset") forceUpdate();
	}, [width, forceUpdate]);

	//We will then need to update the width of the column so that the header cell will
	//have a value set in pixels
	const shouldUpdateWidth = useCompare(forceUpdateTime, false);
	React.useEffect(() => {
		if (shouldUpdateWidth) {
			const newWidth = numToPx(triggerPosition.width);
			onWidthChange(columnId, newWidth);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnId, shouldUpdateWidth, triggerPosition]);

	function handleMenuClose() {
		closeTopMenu();
	}

	const lucideId = getIconIdForCellType(type);

	let contentClassName = "Dashboards__th-content";
	if (resizingColumnId == null) contentClassName += " Dashboards__selectable";

	return (
		<>
			<MenuTrigger
				isCell
				menu={menu}
				shouldRun={resizingColumnId === null}
			>
				<div
					className="Dashboards__th-container"
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
						<Stack spacing="md" align="flex-start" isHorizontal>
							<Icon lucideId={lucideId} size="md" />
							{markdown}
						</Stack>
					</div>
					<ResizeContainer
						currentResizingId={resizingColumnId}
						columnId={columnId}
						width={width}
						onWidthChange={onWidthChange}
						onMenuClose={() =>
							closeTopMenu({ shouldFocusTrigger: false })
						}
					/>
				</div>
			</MenuTrigger>
			<HeaderMenu
				isOpen={isMenuOpen}
				menuCloseRequest={menuCloseRequest}
				top={triggerPosition.top}
				left={triggerPosition.left}
				id={menu.id}
				ref={menuRef}
				aspectRatio={aspectRatio}
				horizontalPadding={horizontalPadding}
				verticalPadding={verticalPadding}
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
				onMenuClose={handleMenuClose}
				onWrapOverflowToggle={onWrapOverflowToggle}
				onNameChange={onNameChange}
				onCurrencyChange={onCurrencyChange}
				onDateFormatChange={onDateFormatChange}
				onVerticalPaddingClick={onVerticalPaddingClick}
				onHorizontalPaddingClick={onHorizontalPaddingClick}
				onAspectRatioClick={onAspectRatioClick}
				onHideClick={onHideClick}
			/>
		</>
	);
}
