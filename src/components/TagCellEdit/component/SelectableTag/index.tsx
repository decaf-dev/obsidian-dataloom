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
} from "src/services/menu/menuSlice";

import "./styles.css";
import Button from "src/components/Button";
import Icon from "src/components/Icon";

interface Props {
	isDarkMode: boolean;
	id: string;
	markdown: string;
	color: string;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function SelectableTag({
	isDarkMode,
	id,
	markdown,
	color,
	onClick,
	onColorChange,
}: Props) {
	const menu = useMenu(MenuLevel.TWO);
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
	const { containerRef, position } = usePosition();

	function handleColorChange(color: string) {
		onColorChange(id, color);
		dispatch(closeTopLevelMenu());
	}

	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(isDarkMode, color);
	return (
		<div
			ref={containerRef}
			className="NLT__selectable-tag NLT__selectable"
			onClick={() => onClick(id)}
		>
			<TagColorMenu
				menuId={menu.id}
				top={position.top - 125}
				left={position.left + position.width - 50}
				isOpen={isOpen}
				selectedColor={color}
				onColorClick={(color) => handleColorChange(color)}
			/>
			<div className={tagClass}>
				<div className="NLT__tag-content">{markdown}</div>
			</div>
			<Button
				icon={<Icon icon={IconType.MORE_HORIZ} />}
				isDarker
				onClick={(e) => {
					e.stopPropagation();
					dispatch(openMenu(menu));
				}}
			/>
		</div>
	);
}
