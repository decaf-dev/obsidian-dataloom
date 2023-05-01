import TagColorMenu from "src/react/BodyCell/components/TagColorMenu";

import { IconType } from "src/services/icon/types";
import { MenuLevel, MenuPosition } from "src/services/menu/types";
import { useMenu } from "src/services/menu/hooks";
import { useAppDispatch } from "src/services/redux/hooks";
import {
	openMenu,
	closeTopLevelMenu,
	closeAllMenus,
} from "src/services/menu/menuSlice";

import "./styles.css";
import Button from "src/react/shared/Button";
import Icon from "src/react/shared/Icon";
import Tag from "src/react/shared/Tag";
import { Color } from "src/shared/types";
import { shiftMenuIntoViewContent } from "src/services/menu/utils";

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
