import TagColorMenu from "src/components/Cell/components/TagColorMenu";

import { IconType } from "src/services/icon/types";
import { MenuLevel } from "src/services/menu/types";
import { useMenu } from "src/services/menu/hooks";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import {
	openMenu,
	isMenuOpen,
	closeTopLevelMenu,
	closeAllMenus,
} from "src/services/menu/menuSlice";

import "./styles.css";
import Button from "src/components/Button";
import Icon from "src/components/Icon";
import Tag from "src/components/Tag";
import { Color } from "src/services/color/types";

interface Props {
	isDarkMode: boolean;
	id: string;
	markdown: string;
	color: Color;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: Color) => void;
	onDeleteClick: (tagId: string) => void;
}

export default function SelectableTag({
	isDarkMode,
	id,
	markdown,
	color,
	onClick,
	onColorChange,
	onDeleteClick,
}: Props) {
	const menu = useMenu(MenuLevel.TWO);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu.id));

	const dispatch = useAppDispatch();

	function handleColorChange(color: Color) {
		onColorChange(id, color);
		dispatch(closeTopLevelMenu());
	}

	function handleDeleteClick() {
		onDeleteClick(id);
		dispatch(closeAllMenus());
	}

	const { top, left, width } = menu.position;
	return (
		<>
			<div
				ref={menu.containerRef}
				className="NLT__selectable-tag NLT__selectable"
				onClick={() => onClick(id)}
			>
				<Tag
					isDarkMode={isDarkMode}
					markdown={markdown}
					color={color}
					maxWidth="150px"
				/>
				<Button
					icon={<Icon type={IconType.MORE_HORIZ} />}
					isFlat
					onClick={(e) => {
						// Prevents a tag from being added when the button is clicked
						// we just want to open the menu
						e.stopPropagation();
						dispatch(
							openMenu({
								id: menu.id,
								level: menu.level,
							})
						);
					}}
				/>
			</div>
			<TagColorMenu
				menuId={menu.id}
				top={top - 125}
				left={left + width - 50}
				isOpen={isOpen}
				selectedColor={color}
				onColorClick={(color) => handleColorChange(color)}
				onDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
