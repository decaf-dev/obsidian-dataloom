import TagColorMenu from "src/react/table-app/tag-color-menu";

import { MenuLevel, MenuPosition } from "src/shared/menu/types";
import { useMenu } from "src/shared/menu/hooks";

import "./styles.css";
import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Tag from "src/react/shared/tag";
import { IconType } from "src/react/shared/icon/types";
import { Color } from "src/shared/types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";

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
	const { menu, isMenuOpen, closeTopLevelMenu, openMenu } = useMenu(
		MenuLevel.TWO
	);

	function handleColorChange(color: Color) {
		onColorChange(id, color);
		closeTopLevelMenu();
	}

	function handleDeleteClick() {
		onDeleteClick(id);
		closeTopLevelMenu();
	}

	const { top, left } = shiftMenuIntoViewContent({
		menuId: menu.id,
		menuPositionEl: menuPosition.positionRef.current,
		menuPosition: menuPosition.position,
		leftOffset: 235,
	});
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
						openMenu(menu);
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
