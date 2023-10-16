import React from "react";

import Icon from "../../shared/icon";
import Stack from "../../shared/stack";
import MenuTrigger from "src/react/shared/menu-trigger";
import ResizeContainer from "./column-resize";
import HeaderMenu from "../header-cell-edit";

import { useCompare, useForceUpdate } from "src/shared/hooks";
import { getIconIdForCellType } from "src/react/shared/icon/utils";
import { numToPx } from "src/shared/conversion";
import { CellType, Column } from "src/shared/loom-state/types/loom-state";

import "./styles.css";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";

interface Props {
	index: number;
	column: Column;
	numSources: number;
	frontmatterKeys: string[];
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
	frontmatterKeys,
	numFrozenColumns,
	resizingColumnId,
	onColumnChange,
	onColumnDeleteClick,
	onFrozenColumnsChange,
	onColumnTypeChange,
}: Props) {
	const { id: columnId, type, width, content } = column;

	const COMPONENT_ID = `header-cell-${columnId}`;
	const menu = useMenu(COMPONENT_ID);

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
			const newWidth = numToPx(menu.position.width);
			onColumnChange(columnId, {
				width: newWidth,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnId, shouldUpdateWidth, menu.position]);

	function handleMenuOpen() {
		menu.onOpen(LoomMenuLevel.ONE, {
			shouldRequestOnClose: true,
		});
	}

	const lucideId = getIconIdForCellType(type);

	let contentClassName = "dataloom-cell--header__inner-container";
	if (resizingColumnId == null) contentClassName += " dataloom-selectable";

	return (
		<>
			<MenuTrigger
				ref={menu.positionRef}
				isCell
				canOpen={resizingColumnId === null}
				onOpen={handleMenuOpen}
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
						onMenuClose={menu.onClose}
					/>
				</div>
			</MenuTrigger>
			<HeaderMenu
				id={menu.id}
				index={index}
				isOpen={menu.isOpen}
				numSources={numSources}
				closeRequest={menu.closeRequest}
				frontmatterKeys={frontmatterKeys}
				position={menu.position}
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
				onClose={menu.onClose}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onColumnTypeChange={onColumnTypeChange}
			/>
		</>
	);
}
