import React, { useMemo } from "react";

import Menu from "../Menu";
import RowMenuItem from "./components/RowMenuItem";
import Icon from "../Icon";

import Button from "../Button";
import { IconType } from "src/services/icon/types";
import { usePositionRef } from "src/services/hooks";
import { useMenu } from "src/services/menu/hooks";
import {
	openMenu,
	closeTopLevelMenu,
	isMenuOpen,
} from "src/services/menu/menuSlice";
import { numToPx } from "src/services/string/conversion";

import "./styles.css";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";

interface Props {
	rowId: string;
	onDeleteClick: (rowId: string) => void;
}

export default function RowMenu({ rowId, onDeleteClick }: Props) {
	const menu = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
	const positionUpdateTime = useAppSelector(
		(state) => state.menu.positionUpdateTime
	);
	const { ref, position } = usePositionRef([positionUpdateTime]);
	function handleButtonClick(e: React.MouseEvent) {
		if (isOpen) {
			dispatch(closeTopLevelMenu());
		} else {
			dispatch(openMenu(menu));
		}
	}

	function handleDeleteClick(rowId: string) {
		onDeleteClick(rowId);
		dispatch(closeTopLevelMenu());
	}

	return (
		<div ref={ref}>
			<Button hasIcon onClick={(e) => handleButtonClick(e)}>
				<Icon icon={IconType.MORE_HORIZ} />
			</Button>
			<Menu
				id={menu.id}
				isOpen={isOpen}
				style={{
					top: numToPx(position.top),
					left: numToPx(position.left - position.width - 65),
				}}
			>
				<div className="NLT__drag-menu">
					<RowMenuItem
						icon={IconType.DELETE}
						content="Delete"
						onClick={() => handleDeleteClick(rowId)}
					/>
				</div>
			</Menu>
		</div>
	);
}
