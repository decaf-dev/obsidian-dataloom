import React from "react";

import MenuHeader from "./menu-header";
import MenuBody from "./menu-body";

import { Tag as TagType } from "src/shared/table-state/types";
import { Color } from "src/shared/types";
import { MenuPosition } from "src/shared/menu/types";
import { randomColor } from "src/shared/color";

import { css } from "@emotion/react";
import { useCompare } from "src/shared/hooks";

interface Props {
	tags: TagType[];
	cellId: string;
	menuCloseRequestTime: number | null;
	menuPosition: MenuPosition;
	isMenuVisible: boolean;
	onTagClick: (tagId: string) => void;
	onTagAdd: (markdown: string, color: Color) => void;
	onRemoveTag: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: Color) => void;
	onTagDelete: (tagId: string) => void;
	onMenuClose: () => void;
}

export default function TagCellEdit({
	tags,
	cellId,
	menuCloseRequestTime,
	menuPosition,
	isMenuVisible,
	onTagClick,
	onTagAdd,
	onTagColorChange,
	onTagDelete,
	onRemoveTag,
	onMenuClose,
}: Props) {
	const [inputValue, setInputValue] = React.useState("");
	const [newTagColor] = React.useState(randomColor());

	function handleTagAdd(markdown: string, color: Color) {
		onTagAdd(markdown, color);
		setInputValue("");
	}

	const hasCloseRequestTimeChange = useCompare(menuCloseRequestTime);

	React.useEffect(() => {
		if (hasCloseRequestTimeChange && menuCloseRequestTime !== null) {
			const shouldAddTag =
				tags.find((tag) => tag.markdown === inputValue) === undefined;
			if (shouldAddTag) handleTagAdd(inputValue, newTagColor);
			onMenuClose();
		}
	}, [tags, inputValue, newTagColor, hasCloseRequestTimeChange]);

	return (
		<div
			css={css`
				background-color: var(--background-primary);
			`}
		>
			<MenuHeader
				isMenuVisible={isMenuVisible}
				cellId={cellId}
				inputValue={inputValue}
				tags={tags}
				onInputValueChange={setInputValue}
				onRemoveTag={onRemoveTag}
			/>
			<MenuBody
				menuPosition={menuPosition}
				inputValue={inputValue}
				tags={tags}
				newTagColor={newTagColor}
				onTagAdd={handleTagAdd}
				onTagClick={onTagClick}
				onTagDelete={onTagDelete}
				onTagColorChange={onTagColorChange}
			/>
		</div>
	);
}
