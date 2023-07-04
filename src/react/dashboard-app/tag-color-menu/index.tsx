import React from "react";

import Menu from "src/react/shared/menu";
import ColorItem from "./components/color-item";
import Text from "src/react/shared/text";

import { useAppSelector } from "src/redux/global/hooks";

import Divider from "../../shared/divider";
import Stack from "../../shared/stack";
import MenuItem from "../../shared/menu-item";

import { Color } from "src/shared/types";
import Padding from "src/react/shared/padding";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	selectedColor: string;
	onColorClick: (color: Color) => void;
	onDeleteClick: () => void;
}

const TagColorMenu = React.forwardRef<HTMLDivElement, Props>(
	function TagColorMenu(
		{
			menuId,
			isOpen,
			top,
			left,
			selectedColor,
			onColorClick,
			onDeleteClick,
		}: Props,
		ref
	) {
		const { isDarkMode } = useAppSelector((state) => state.global);

		return (
			<Menu ref={ref} id={menuId} isOpen={isOpen} top={top} left={left}>
				<div className="Dashboards__tag-color-menu">
					<Stack spacing="sm" isVertical>
						<Padding px="lg" py="sm">
							<Text value="Color" />
						</Padding>
						<div>
							{Object.values(Color).map((color) => (
								<ColorItem
									isDarkMode={isDarkMode}
									key={color}
									color={color}
									onColorClick={onColorClick}
									isSelected={selectedColor === color}
								/>
							))}
						</div>
						<Divider />
						<MenuItem
							lucideId="trash-2"
							name="Delete"
							onClick={onDeleteClick}
						/>
					</Stack>
				</div>
			</Menu>
		);
	}
);

export default TagColorMenu;
