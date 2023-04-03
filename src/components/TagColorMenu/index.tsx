import React from "react";

import Menu from "src/components/Menu";
import ColorItem from "./components/ColorItem";
import Button from "../Button";
import Icon from "../Icon";
import Text from "src/components/Text";

import { IconType } from "src/services/icon/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { closeTopLevelMenu } from "src/services/menu/menuSlice";

import { COLOR } from "src/constants";

import "./styles.css";
import Divider from "../Divider";
import Stack from "../Stack";
import MenuItem from "../MenuItem";
import Flex from "../Flex";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	selectedColor: string;
	onColorClick: (color: string) => void;
	onDeleteClick: () => void;
}

export default function TagColorMenu({
	menuId,
	isOpen,
	top,
	left,
	selectedColor,
	onColorClick,
	onDeleteClick,
}: Props) {
	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);

	return (
		<Menu id={menuId} isOpen={isOpen} top={top} left={left}>
			<div className="NLT__tag-color-menu">
				<Stack spacing="md" isVertical>
					<Text content="Color" />
					<Stack spacing="sm" isVertical>
						{Object.values(COLOR).map((color) => (
							<ColorItem
								isDarkMode={isDarkMode}
								key={color}
								color={color}
								onColorClick={onColorClick}
								isSelected={selectedColor === color}
							/>
						))}
					</Stack>
					<Divider />
					<MenuItem
						iconType={IconType.DELETE}
						name="Delete"
						onClick={onDeleteClick}
					/>
				</Stack>
			</div>
		</Menu>
	);
}
