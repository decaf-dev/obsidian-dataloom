import React from "react";

import Menu from "src/components/Menu";
import ColorItem from "./components/ColorItem";
import Button from "../Button";
import Icon from "../Icon";

import { IconType } from "src/services/icon/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { closeTopLevelMenu } from "src/services/menu/menuSlice";

import { COLOR } from "src/constants";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	selectedColor: string;
	onColorClick: (color: string) => void;
}

export default function TagColorMenu({
	menuId,
	isOpen,
	top,
	left,
	selectedColor,
	onColorClick,
}: Props) {
	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);
	function handleMenuCloseClick(e: React.MouseEvent) {
		e.stopPropagation();
		dispatch(closeTopLevelMenu());
	}

	return (
		<Menu id={menuId} isOpen={isOpen} top={top} left={left}>
			<div className="NLT__tag-color-menu">
				<div className="NLT__tag-color-menu-header">
					<div className="NLT__tag-color-menu-title">Colors</div>
					<Button
						icon={<Icon type={IconType.CLOSE} />}
						onClick={handleMenuCloseClick}
					/>
				</div>
				<div className="NLT__tag-color-container">
					{Object.values(COLOR).map((color) => (
						<ColorItem
							isDarkMode={isDarkMode}
							key={color}
							color={color}
							onColorClick={onColorClick}
							isSelected={selectedColor === color}
						/>
					))}
				</div>
			</div>
		</Menu>
	);
}
