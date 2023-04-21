import Menu from "../Menu";
import Icon from "../Icon";

import Button from "../Button";
import { IconType } from "src/services/icon/types";
import { useMenu } from "src/services/menu/hooks";
import { openMenu, closeTopLevelMenu } from "src/services/menu/menuSlice";

import "./styles.css";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import RowMenu from "./components/RowMenu";
import { isMenuOpen, shiftMenuIntoViewContent } from "src/services/menu/utils";
import { useForceUpdate } from "src/services/hooks";
import { useEffect } from "react";

interface Props {
	rowId: string;
	onDeleteClick: (rowId: string) => void;
}

export default function RowOptions({ rowId, onDeleteClick }: Props) {
	const [menu, menuPosition] = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();
	const shouldOpenMenu = useAppSelector((state) =>
		isMenuOpen(state, menu.id)
	);

	function handleButtonClick() {
		if (shouldOpenMenu) {
			dispatch(closeTopLevelMenu());
		} else {
			dispatch(openMenu(menu));
		}
	}

	function handleDeleteClick(rowId: string) {
		onDeleteClick(rowId);
		dispatch(closeTopLevelMenu());
	}

	const [, forceUpdate] = useForceUpdate();

	//Once the menu opens, we need to force an update so that logic for shiftMenuIntoViewContent will work
	useEffect(() => {
		if (shouldOpenMenu) {
			forceUpdate();
		}
	}, [shouldOpenMenu]);

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
				isOpen={shouldOpenMenu}
				top={top}
				left={left}
				onDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
