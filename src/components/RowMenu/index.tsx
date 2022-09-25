import React, { useMemo } from "react";

import IconButton from "../IconButton";
import Menu from "../Menu";
import RowMenuItem from "./components/RowMenuItem";

import { Icon } from "src/services/icon/types";
import { usePositionRef } from "src/services/hooks";
import { useMenu } from "src/services/menu/hooks";
import {
	openMenu,
	closeTopLevelMenu,
	isMenuOpen,
} from "src/services/menu/menuSlice";
import { numToPx, pxToNum } from "src/services/string/conversion";

import "./styles.css";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";

interface Props {
	rowId: string;
	positionUpdateTime: number;
	onDeleteClick: (rowId: string) => void;
}

export default function RowMenu({
	rowId,
	positionUpdateTime,
	onDeleteClick,
}: Props) {
	const menu = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();
	const { positionRef, position } = usePositionRef([positionUpdateTime]);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
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

	const options = useMemo(() => {
		return [
			{
				name: "delete",
				content: "Delete",
				icon: Icon.DELETE,
				onClick: () => handleDeleteClick(rowId),
			},
		];
	}, [rowId]);

	return (
		<div ref={positionRef}>
			<IconButton icon={Icon.MORE_VERT} onClick={handleButtonClick} />
			<Menu
				id={menu.id}
				isOpen={isOpen}
				style={{
					top: position.top,
					left: numToPx(
						pxToNum(position.left) - pxToNum(position.width) - 65
					),
				}}
			>
				<div className="NLT__drag-menu">
					{options.map((item) => {
						return (
							<RowMenuItem
								key={item.name}
								icon={item.icon}
								iconText={item.content}
								onClick={item.onClick}
							/>
						);
					})}
				</div>
			</Menu>
		</div>
	);
}
