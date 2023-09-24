import TagColorMenu from "src/react/loom-app/tag-color-menu";
import MenuButton from "src/react/shared/menu-button";
import Icon from "src/react/shared/icon";
import Tag from "src/react/shared/tag";

import { Color } from "src/shared/loom-state/types/loom-state";
import { useMenu } from "../../../shared/menu/hooks";
import { LoomMenuLevel } from "../../../shared/menu/types";

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
	const {
		menu,
		triggerRef,
		triggerPosition,
		isOpen,
		closeRequest,
		onOpen,
		onClose,
		onRequestClose,
	} = useMenu({ level: LoomMenuLevel.TWO, shouldRequestOnClose: true });

	function handleColorChange(color: Color) {
		onColorChange(id, color);
		onClose();
	}

	function handleDeleteClick() {
		onDeleteClick(id);
		onClose();
	}

	function handleTagContentChange(value: string) {
		onTagContentChange(id, value);
		onClose();
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
					ref={triggerRef}
					menu={menu}
					icon={<Icon lucideId="more-horizontal" />}
					onOpen={onOpen}
				/>
			</div>
			<TagColorMenu
				isOpen={isOpen}
				id={menu.id}
				triggerPosition={triggerPosition}
				closeRequest={closeRequest}
				content={content}
				selectedColor={color}
				onColorClick={(color) => handleColorChange(color)}
				onDeleteClick={handleDeleteClick}
				onRequestClose={onRequestClose}
				onTagContentChange={handleTagContentChange}
				onClose={onClose}
			/>
		</>
	);
}
