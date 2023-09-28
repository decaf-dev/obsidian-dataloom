import React from "react";

import Icon from "../../shared/icon";
import Stack from "../../shared/stack";
import MenuTrigger from "src/react/shared/menu-trigger";
import ResizeContainer from "./column-resize";
import HeaderMenu from "../header-cell-edit";

import { useCompare, useForceUpdate } from "src/shared/hooks";
import { getIconIdForCellType } from "src/react/shared/icon/utils";
import { useMenu } from "../../shared/menu/hooks";
import { numToPx } from "src/shared/conversion";
import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	NumberFormat,
	PaddingSize,
	SortDir,
} from "src/shared/loom-state/types/loom-state";

import "./styles.css";

interface Props {
	index: number;
	currencyType: CurrencyType;
	numberPrefix: string;
	numberSuffix: string;
	numberSeparator: string;
	numFrozenColumns: number;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
	aspectRatio: AspectRatio;
	numberFormat: NumberFormat;
	columnId: string;
	width: string;
	resizingColumnId: string | null;
	numColumns: number;
	dateFormat: DateFormat;
	content: string;
	shouldWrapOverflow: boolean;
	sortDir: SortDir;
	type: CellType;
	onSortClick: (columnId: string, sortDir: SortDir) => void;
	onTypeSelect: (columnId: string, type: CellType) => void;
	onDeleteClick: (columnId: string) => void;
	onWidthChange: (columnId: string, width: string) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onContentChange: (columnId: string, value: string) => void;
	onNumberFormatChange: (
		columnId: string,
		format: NumberFormat,
		options?: {
			currency: CurrencyType;
		}
	) => void;
	onNumberPrefixChange: (columnId: string, value: string) => void;
	onNumberSuffixChange: (columnId: string, value: string) => void;
	onNumberSeparatorChange: (columnId: string, value: string) => void;
	onDateFormatChange: (columnId: string, value: DateFormat) => void;
	onVerticalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onHorizontalPaddingClick: (columnId: string, value: PaddingSize) => void;
	onAspectRatioClick: (columnId: string, value: AspectRatio) => void;
	onHideClick: (columnId: string) => void;
	onFrozenColumnsChange: (value: number) => void;
}

export default function HeaderCellContainer({
	index,
	columnId,
	currencyType,
	numFrozenColumns,
	numberFormat,
	numberPrefix,
	numberSeparator,
	numberSuffix,
	width,
	dateFormat,
	horizontalPadding,
	verticalPadding,
	aspectRatio,
	content,
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
	onContentChange,
	onNumberFormatChange,
	onNumberPrefixChange,
	onNumberSeparatorChange,
	onNumberSuffixChange,
	onDateFormatChange,
	onHideClick,
	onFrozenColumnsChange,
}: Props) {
	const {
		menu,
		triggerRef,
		triggerPosition,
		isOpen,
		closeRequest,
		onOpen,
		onClose,
		onRequestClose,
	} = useMenu({
		shouldRequestOnClose: true,
	});

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

	const lucideId = getIconIdForCellType(type);

	let contentClassName = "dataloom-cell--header__inner-container";
	if (resizingColumnId == null) contentClassName += " dataloom-selectable";

	return (
		<>
			<MenuTrigger
				ref={triggerRef}
				menu={menu}
				isCell
				shouldOpenOnTrigger={resizingColumnId === null}
				onOpen={onOpen}
			>
				<div
					className="dataloom-cell--header__container"
					style={{
						width,
					}}
				>
					<div className={contentClassName}>
						<Stack isHorizontal spacing="md" align="center">
							<Icon lucideId={lucideId} size="md" />
							{content}
						</Stack>
					</div>
					<ResizeContainer
						currentResizingId={resizingColumnId}
						columnId={columnId}
						width={width}
						onWidthChange={onWidthChange}
						onMenuClose={() => onClose(false)}
					/>
				</div>
			</MenuTrigger>
			<HeaderMenu
				index={index}
				isOpen={isOpen}
				closeRequest={closeRequest}
				triggerPosition={triggerPosition}
				id={menu.id}
				numFrozenColumns={numFrozenColumns}
				aspectRatio={aspectRatio}
				horizontalPadding={horizontalPadding}
				verticalPadding={verticalPadding}
				numberFormat={numberFormat}
				currencyType={currencyType}
				numberPrefix={numberPrefix}
				numberSuffix={numberSuffix}
				numberSeparator={numberSeparator}
				dateFormat={dateFormat}
				canDeleteColumn={numColumns > 1}
				columnId={columnId}
				shouldWrapOverflow={shouldWrapOverflow}
				content={content}
				columnSortDir={sortDir}
				columnType={type}
				numColumns={numColumns}
				onSortClick={onSortClick}
				onTypeSelect={onTypeSelect}
				onDeleteClick={onDeleteClick}
				onClose={onClose}
				onRequestClose={onRequestClose}
				onWrapOverflowToggle={onWrapOverflowToggle}
				onContentChange={onContentChange}
				onNumberFormatChange={onNumberFormatChange}
				onNumberPrefixChange={onNumberPrefixChange}
				onNumberSeparatorChange={onNumberSeparatorChange}
				onNumberSuffixChange={onNumberSuffixChange}
				onDateFormatChange={onDateFormatChange}
				onVerticalPaddingClick={onVerticalPaddingClick}
				onHorizontalPaddingClick={onHorizontalPaddingClick}
				onAspectRatioClick={onAspectRatioClick}
				onHideClick={onHideClick}
				onFrozenColumnsChange={onFrozenColumnsChange}
			/>
		</>
	);
}
