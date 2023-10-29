import React from "react";

import TagColorMenu from "src/react/loom-app/tag-color-menu";
import MenuButton from "src/react/shared/menu-button";
import Icon from "src/react/shared/icon";
import Tag from "src/react/shared/tag";

import { Color } from "src/shared/loom-state/types/loom-state";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";

import "./styles.css";

interface Props {
	id: string;
	content: string;
	color: Color;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: Color) => void;
	onDeleteClick: (tagId: string) => void;
	onTagContentChange: (tagId: string, value: string) => void;
}

export default function SelectableTag({
	id,
	content,
	color,
	onClick,
	onColorChange,
	onDeleteClick,
	onTagContentChange,
}: Props) {
	const COMPONENT_ID = `selectable-tag-${id}`;
	const menu = useMenu(COMPONENT_ID);

	function handleColorChange(color: Color) {
		onColorChange(id, color);
		menu.onClose();
	}

	function handleDeleteClick() {
		onDeleteClick(id);
		menu.onClose();
	}

	function handleTagContentChange(value: string) {
		onTagContentChange(id, value);
		menu.onClose();
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
				className="dataloom-selectable-tag dataloom-focusable dataloom-selectable"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<Tag content={content} color={color} maxWidth="150px" />
				<MenuButton
					isFocused={menu.isTriggerFocused}
					menuId={menu.id}
					ref={menu.triggerRef}
					level={LoomMenuLevel.TWO}
					icon={<Icon lucideId="more-horizontal" />}
					onOpen={() =>
						menu.onOpen(LoomMenuLevel.TWO, {
							shouldRequestOnClose: true,
						})
					}
				/>
			</div>
			<TagColorMenu
				isOpen={menu.isOpen}
				id={menu.id}
				position={menu.position}
				closeRequest={menu.closeRequest}
				content={content}
				selectedColor={color}
				onColorClick={(color) => handleColorChange(color)}
				onDeleteClick={handleDeleteClick}
				onTagContentChange={handleTagContentChange}
				onClose={menu.onClose}
			/>
		</>
	);
}
