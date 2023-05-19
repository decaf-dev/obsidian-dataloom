import TagColorMenu from "src/react/table-app/tag-color-menu";

import { MenuLevel, MenuPosition } from "src/shared/menu/types";
import { useMenu } from "src/shared/menu/hooks";

import { Button } from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Tag from "src/react/shared/tag";
import { Color } from "src/shared/types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import { css } from "@emotion/react";

interface Props {
	id: string;
	menuPosition: MenuPosition;
	markdown: string;
	color: Color;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: Color) => void;
	onDeleteClick: (tagId: string) => void;
}

export default function SelectableTag({
	menuPosition,
	id,
	markdown,
	color,
	onClick,
	onColorChange,
	onDeleteClick,
}: Props) {
	const { menu, isMenuOpen, closeTopMenu, openMenu } = useMenu(MenuLevel.TWO);

	function handleColorChange(color: Color) {
		onColorChange(id, color);
		closeTopMenu();
	}

	function handleDeleteClick() {
		onDeleteClick(id);
		closeTopMenu();
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
				css={css`
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: var(--nlt-spacing--sm) var(--nlt-spacing--md);
					overflow: hidden;
				`}
				className="NLT__selectable"
				onClick={() => onClick(id)}
			>
				<Tag markdown={markdown} color={color} maxWidth="150px" />
				<Button
					icon={<Icon lucideId="more-horizontal" />}
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
