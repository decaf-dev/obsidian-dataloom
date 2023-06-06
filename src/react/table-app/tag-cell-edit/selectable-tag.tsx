import TagColorMenu from "src/react/table-app/tag-color-menu";

import { MenuLevel } from "src/shared/menu/types";
import { useMenu } from "src/shared/menu/hooks";

import { Button } from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Tag from "src/react/shared/tag";
import { Color } from "src/shared/types/types";
import { css } from "@emotion/react";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";

interface Props {
	id: string;
	markdown: string;
	color: Color;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: Color) => void;
	onDeleteClick: (tagId: string) => void;
}

export default function SelectableTag({
	id,
	markdown,
	color,
	onClick,
	onColorChange,
	onDeleteClick,
}: Props) {
	const { menu, isMenuOpen, menuRef, closeTopMenu, openMenu } = useMenu(
		MenuLevel.TWO
	);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "right",
		leftOffset: -55,
		topOffset: -100,
	});

	function handleColorChange(color: Color) {
		onColorChange(id, color);
		closeTopMenu();
	}

	function handleDeleteClick() {
		onDeleteClick(id);
		closeTopMenu();
	}

	return (
		<>
			<div
				ref={triggerRef}
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
				isOpen={isMenuOpen}
				ref={menuRef}
				menuId={menu.id}
				top={triggerPosition.top}
				left={triggerPosition.left}
				selectedColor={color}
				onColorClick={(color) => handleColorChange(color)}
				onDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
