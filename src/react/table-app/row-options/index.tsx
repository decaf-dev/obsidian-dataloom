import Icon from "../../shared/icon";

import Button from "../../shared/button";
import { useMenu } from "src/redux/menu/hooks";
import { openMenu, closeTopLevelMenu } from "src/redux/menu/menu-slice";

import "./styles.css";
import { MenuLevel } from "src/redux/menu/types";
import { useAppDispatch } from "src/redux/global/hooks";
import RowMenu from "./components/RowMenu";
import { shiftMenuIntoViewContent } from "src/redux/menu/utils";
import { IconType } from "src/react/shared/icon/types";

interface Props {
	rowId: string;
	onDeleteClick: (rowId: string) => void;
}

export default function RowOptions({ rowId, onDeleteClick }: Props) {
	const { menu, menuPosition, isMenuOpen } = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();

	function handleButtonClick() {
		if (isMenuOpen) {
			dispatch(closeTopLevelMenu());
		} else {
			dispatch(openMenu(menu));
		}
	}

	function handleDeleteClick(rowId: string) {
		onDeleteClick(rowId);
		dispatch(closeTopLevelMenu());
	}

	const { top, left } = shiftMenuIntoViewContent(
		menu.id,
		menuPosition.positionRef.current,
		menuPosition.position,
		0,
		-95
	);

	return (
		<>
			<div className="NLT__row-options">
				<div ref={menuPosition.positionRef}>
					<Button
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
