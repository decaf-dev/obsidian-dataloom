import Icon from "../../shared/icon";

import { MenuButton } from "../../shared/button";
import { useMenu } from "src/shared/menu/hooks";

import "./styles.css";
import { MenuLevel } from "src/shared/menu/types";
import RowMenu from "./components/RowMenu";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";

interface Props {
	rowId: string;
	onDeleteClick: (rowId: string) => void;
}

export default function RowOptions({ rowId, onDeleteClick }: Props) {
	const { menu, menuPosition, isMenuOpen, openMenu, closeTopMenu } = useMenu(
		MenuLevel.ONE
	);

	function handleButtonClick() {
		if (isMenuOpen) {
			closeTopMenu();
		} else {
			openMenu(menu);
		}
	}

	function handleDeleteClick(rowId: string) {
		onDeleteClick(rowId);
		closeTopMenu();
	}

	const {
		position: { top, left },
		isMenuReady,
	} = shiftMenuIntoViewContent({
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
						icon={<Icon lucideId="grip-vertical" />}
						ariaLabel="Drag to move or click to open"
						onClick={() => handleButtonClick()}
						onMouseDown={(e) => {
							//On mouse down we want to create a synthetic drag event
							//We do this because we have prevent the ability for the user to drag the row
							//Otherwise the user would be able to drag the row from any cell in the table
							const el = e.target as HTMLElement;
							const row = el.closest("tr");
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
				isReady={isMenuReady}
				isOpen={isMenuOpen}
				top={top}
				left={left}
				onDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
