import React from "react";

import Menu from "src/components/Menu";

import { COLOR } from "src/constants";
import ColorItem from "./components/ColorItem";
import { Close } from "@mui/icons-material";
import "./styles.css";
import { useAppDispatch } from "src/services/redux/hooks";
import { closeTopLevelMenu } from "src/services/menu/menuSlice";

interface Props {
	menuId: string;
	isOpen: boolean;
	style: {
		top: string;
		left: string;
	};
	selectedColor: string;
	onColorClick: (color: string) => void;
}

export default function TagColorMenu({
	menuId,
	isOpen,
	style,
	selectedColor,
	onColorClick,
}: Props) {
	const dispatch = useAppDispatch();
	function handleMenuCloseClick(e: React.MouseEvent) {
		//TODO this is more of a hack than a fix
		e.stopPropagation();
		dispatch(closeTopLevelMenu());
	}

	return (
		<Menu id={menuId} isOpen={isOpen} style={style}>
			<div className="NLT__tag-color-menu">
				<div className="NLT__tag-color-menu-header">
					<div className="NLT__tag-color-menu-title">Colors</div>
					<Close
						className="NLT__icon--md NLT__icon--selectable"
						onClick={handleMenuCloseClick}
					/>
				</div>
				<div className="NLT__tag-color-container">
					{Object.values(COLOR).map((color) => (
						<ColorItem
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
