import React, { useMemo, useRef } from "react";

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
		<div ref={ref}>
			<IconButton icon={Icon.MORE_VERT} onClick={handleButtonClick} />
			<Menu
				id={menu.id}
				isOpen={isOpen}
				style={{
					top: numToPx(position.top),
					left: numToPx(position.left - position.width - 65),
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
