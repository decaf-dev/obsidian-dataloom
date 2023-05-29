import Icon from "../../shared/icon";
import { MenuButton } from "../../shared/button";
import RowMenu from "./components/RowMenu";

import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import "./styles.css";

interface Props {
	rowId: string;
	onDeleteClick: (rowId: string) => void;
}

export default function RowOptions({ rowId, onDeleteClick }: Props) {
	const { menu, isMenuOpen, menuRef, openMenu, closeTopMenu } = useMenu(
		MenuLevel.ONE
	);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "left",
	});

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

	return (
		<>
			<div className="NLT__row-options">
				<div ref={triggerRef}>
					<MenuButton
						menuId={menu.id}
						icon={<Icon lucideId="grip-vertical" />}
						ariaLabel="Drag to move or click to open"
						onClick={() => handleButtonClick()}
						onMouseDown={(e) => {
							//On mouse down we create a synthetic drag event
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
				ref={menuRef}
				isOpen={isMenuOpen}
				top={triggerPosition.top}
				left={triggerPosition.left}
				onDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
