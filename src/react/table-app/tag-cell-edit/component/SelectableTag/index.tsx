import TagColorMenu from "src/react/table-app/tag-color-menu";

import { MenuLevel, MenuPosition } from "src/redux/menu/types";
import { useMenu } from "src/redux/menu/hooks";
import { useAppDispatch } from "src/redux/global/hooks";
import {
	openMenu,
	closeTopLevelMenu,
	closeAllMenus,
} from "src/redux/menu/menu-slice";

import "./styles.css";
import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Tag from "src/react/shared/tag";
import { IconType } from "src/react/shared/icon/types";
import { Color } from "src/shared/types";
import { shiftMenuIntoViewContent } from "src/redux/menu/utils";

interface Props {
	isDarkMode: boolean;
	id: string;
	menuPosition: MenuPosition;
	markdown: string;
	color: Color;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: Color) => void;
	onDeleteClick: (tagId: string) => void;
}

export default function SelectableTag({
	isDarkMode,
	menuPosition,
	id,
	markdown,
	color,
	onClick,
	onColorChange,
	onDeleteClick,
}: Props) {
	const { menu, isMenuOpen } = useMenu(MenuLevel.TWO);
	const dispatch = useAppDispatch();

	function handleColorChange(color: Color) {
		onColorChange(id, color);
		dispatch(closeTopLevelMenu());
	}

	function handleDeleteClick() {
		onDeleteClick(id);
		dispatch(closeAllMenus());
	}

	const { top, left } = shiftMenuIntoViewContent(
		menu.id,
		menuPosition.positionRef.current,
		menuPosition.position,
		0,
		235
	);
	return (
		<>
			<div
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
					isSimple
					onClick={(e) => {
						// Prevents a tag from being added when the button is clicked
						// we just want to open the menu
						e.stopPropagation();
						dispatch(openMenu(menu));
					}}
				/>
			</div>
			<TagColorMenu
				menuId={menu.id}
				top={top}
				left={left}
				isOpen={isMenuOpen}
				selectedColor={color}
				onColorClick={(color) => handleColorChange(color)}
				onDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
