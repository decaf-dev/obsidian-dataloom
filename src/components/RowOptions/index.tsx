import Icon from "../Icon";

import Button from "../Button";
import { IconType } from "src/services/icon/types";
import { useMenu } from "src/services/menu/hooks";
import { openMenu, closeTopLevelMenu } from "src/services/menu/menuSlice";

import "./styles.css";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch } from "src/services/redux/hooks";
import RowMenu from "./components/RowMenu";
import { shiftMenuIntoViewContent } from "src/services/menu/utils";

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
		menuPosition.position.height,
		0
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
