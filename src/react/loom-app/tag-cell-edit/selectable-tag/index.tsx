import TagColorMenu from "src/react/loom-app/tag-color-menu";
import MenuButton from "src/react/shared/menu-button";
import Icon from "src/react/shared/icon";
import Tag from "src/react/shared/tag";

import { MenuLevel } from "src/shared/menu/types";
import { useMenu } from "src/shared/menu/hooks";
import { Color } from "src/shared/loom-state/types";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";

import "./styles.css";

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
	const { menu, isMenuOpen, menuRef, closeTopMenu } = useMenu(MenuLevel.TWO);
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

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//Stop propagation so the the menu doesn't remove the focus class
			e.stopPropagation();
			onClick(id);
		}
	}

	function handleClick(e: React.MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.classList.contains("dataloom-menu-trigger")) return;

		//Stop propagation so the the menu doesn't remove the focus class
		e.stopPropagation();
		onClick(id);
	}

	return (
		<>
			<div
				tabIndex={0}
				ref={triggerRef}
				className="dataloom-selectable-tag dataloom-focusable dataloom-selectable"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<Tag markdown={markdown} color={color} maxWidth="150px" />
				<MenuButton
					icon={<Icon lucideId="more-horizontal" />}
					menu={menu}
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
