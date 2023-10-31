import Icon from "../../shared/icon";
import Stack from "../../shared/stack";
import MenuTrigger from "src/react/shared/menu-trigger";
import ResizeContainer from "./column-resize";
import HeaderMenu from "../header-cell-edit";

import { getIconIdForCellType } from "src/react/shared/icon/utils";
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

	const lucideId = getIconIdForCellType(type);

	let contentClassName = "dataloom-cell--header__inner-container";
	if (resizingColumnId == null) contentClassName += " dataloom-selectable";

	return (
		<>
			<MenuTrigger
				ref={menu.triggerRef}
				menuId={menu.id}
				variant="cell"
				isFocused={menu.isTriggerFocused}
				level={LoomMenuLevel.ONE}
				shouldRunTrigger={resizingColumnId === null}
				onOpen={() =>
					menu.onOpen(LoomMenuLevel.ONE, {
						shouldRequestOnClose: true,
					})
				}
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
						columnIndex={index}
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
