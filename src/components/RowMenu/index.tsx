import React, { useEffect, useMemo } from "react";

import IconButton from "../IconButton";
import Menu from "../Menu";
import RowMenuItem from "./components/RowMenuItem";
import { useMenuId } from "../MenuProvider";

import { Icon } from "src/services/icon/types";
import { usePositionRef } from "src/services/hooks";
import { useId } from "src/services/hooks";
import { numToPx, pxToNum } from "src/services/string/conversion";

import "./styles.css";

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
	const menuId = useId();
	const { isMenuOpen, openMenu, closeMenu, isMenuRequestingClose } =
		useMenuId(menuId);

	const { positionRef, position } = usePositionRef([positionUpdateTime]);

	useEffect(() => {
		if (isMenuRequestingClose) {
			closeMenu();
		}
	}, [isMenuRequestingClose]);

	function handleButtonClick(e: React.MouseEvent) {
		if (isMenuOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	}

	function handleDeleteClick(rowId: string) {
		onDeleteClick(rowId);
		closeMenu();
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
				id={menuId}
				isOpen={isMenuOpen}
				style={{
					top: numToPx(
						pxToNum(position.top) + pxToNum(position.height)
					),
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
