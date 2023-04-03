import { findColorClass } from "src/services/color";

import TagColorMenu from "src/components/TagColorMenu";

import { IconType } from "src/services/icon/types";
import { MenuLevel } from "src/services/menu/types";
import { useMenu, usePosition } from "src/services/menu/hooks";
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

interface Props {
	isDarkMode: boolean;
	id: string;
	markdown: string;
	color: string;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
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
	//TODO refactor into useMenu hook
	const menu = useMenu(MenuLevel.TWO);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
	const { containerRef, position } = usePosition();

	const dispatch = useAppDispatch();

	function handleColorChange(color: string) {
		onColorChange(id, color);
		dispatch(closeTopLevelMenu());
	}

	function handleDeleteClick() {
		onDeleteClick(id);
		dispatch(closeAllMenus());
	}

	return (
		<>
			<div
				ref={containerRef}
				className="NLT__selectable-tag NLT__selectable"
				onClick={() => onClick(id)}
			>
				<Tag
					isDarkMode={isDarkMode}
					markdown={markdown}
					color={color}
					width="150px"
				/>
				<Button
					icon={<Icon type={IconType.MORE_HORIZ} />}
					isDarker
					onClick={(e) => {
						e.stopPropagation();
						dispatch(openMenu(menu));
					}}
				/>
			</div>
			<TagColorMenu
				menuId={menu.id}
				top={position.top - 125}
				left={position.left + position.width - 50}
				isOpen={isOpen}
				selectedColor={color}
				onColorClick={(color) => handleColorChange(color)}
				onDeleteClick={() => handleDeleteClick()}
			/>
		</>
	);
}
