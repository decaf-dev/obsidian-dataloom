import Icon from "../../shared/icon";

import { MenuButton } from "../../shared/button";
import { useMenu } from "src/shared/menu/hooks";

import "./styles.css";
import { MenuLevel } from "src/shared/menu/types";
import RowMenu from "./components/RowMenu";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import { IconType } from "src/react/shared/icon/types";

interface Props {
	rowId: string;
	onDeleteClick: (rowId: string) => void;
}

export default function RowOptions({ rowId, onDeleteClick }: Props) {
	const { menu, menuPosition, isMenuOpen, openMenu, closeTopLevelMenu } =
		useMenu(MenuLevel.ONE);

	function handleButtonClick() {
		if (isMenuOpen) {
			closeTopLevelMenu();
		} else {
			openMenu(menu);
		}
	}

	function handleDeleteClick(rowId: string) {
		onDeleteClick(rowId);
		closeTopLevelMenu();
	}

	const { top, left } = shiftMenuIntoViewContent({
		menuId: menu.id,
		menuPositionEl: menuPosition.positionRef.current,
		menuPosition: menuPosition.position,
		leftOffset: -95,
	});

	return (
		<>
			<div className="NLT__row-options">
				<div ref={menuPosition.positionRef}>
					<MenuButton
						menuId={menu.id}
						icon={<Icon type={IconType.DRAG_INDICATOR} />}
						ariaLabel="Drag to move or click to open"
						onClick={() => handleButtonClick()}
						onMouseDown={(e) => {
							const el = e.target as HTMLElement;
							const row = el.closest(".NLT__tr");
							if (row) {
								row.setAttr("draggable", true);
								const dragStartEvent = new DragEvent(
									"dragstart"
								);
								Object.defineProperty(
									dragStartEvent,
									"target",
									{
										value: row,
									}
								);
								row.dispatchEvent(dragStartEvent);
							}
						}}
					/>
				</div>
			</div>
			<RowMenu
				id={menu.id}
				rowId={rowId}
				isOpen={isMenuOpen}
				top={top}
				left={left}
				onDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
