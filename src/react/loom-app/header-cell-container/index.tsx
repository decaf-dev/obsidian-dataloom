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
import { CellType, Column } from "src/shared/loom-state/types/loom-state";

import "./styles.css";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";

interface Props {
	index: number;
	column: Column;
	numSources: number;
	numColumns: number;
	numFrozenColumns: number;
	resizingColumnId: string | null;
	onColumnDeleteClick: (columnId: string) => void;
	onColumnChange: ColumnChangeHandler;
	onFrozenColumnsChange: (value: number) => void;
	onColumnTypeChange: (columnId: string, type: CellType) => void;
}

export default function HeaderCellContainer({
	index,
	column,
	numSources,
	numColumns,
	numFrozenColumns,
	resizingColumnId,
	onColumnChange,
	onColumnDeleteClick,
	onFrozenColumnsChange,
	onColumnTypeChange,
}: Props) {
	const { id: columnId, type, width, content } = column;

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
			onColumnChange(columnId, {
				width: newWidth,
			});
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
						onWidthChange={(id, value) => {
							onColumnChange(id, {
								width: value,
							});
						}}
						onMenuClose={() => onClose(false)}
					/>
				</div>
			</MenuTrigger>
			<HeaderMenu
				index={index}
				isOpen={isOpen}
				numSources={numSources}
				closeRequest={closeRequest}
				triggerPosition={triggerPosition}
				id={menu.id}
				numFrozenColumns={numFrozenColumns}
				column={column}
				canDeleteColumn={
					numColumns > 1 &&
					type !== CellType.SOURCE_FILE &&
					type !== CellType.SOURCE
				}
				numColumns={numColumns}
				onColumnDeleteClick={onColumnDeleteClick}
				onColumnChange={onColumnChange}
				onClose={onClose}
				onRequestClose={onRequestClose}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onColumnTypeChange={onColumnTypeChange}
			/>
		</>
	);
}
