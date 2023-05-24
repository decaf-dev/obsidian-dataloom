import React from "react";

import MenuHeader from "./menu-header";
import MenuBody from "./menu-body";

import { Tag as TagType } from "src/shared/types/types";
import { Color } from "src/shared/types/types";
import { MenuPosition } from "src/shared/menu/types";
import { randomColor } from "src/shared/color";

import { css } from "@emotion/react";
import { useCompare } from "src/shared/hooks";

interface Props {
	columnTags: TagType[];
	cellTags: TagType[];
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
	columnTags,
	cellTags,
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
				columnTags.find((tag) => tag.markdown === inputValue) ===
				undefined;
			if (shouldAddTag) handleTagAdd(inputValue, newTagColor);
			onMenuClose();
		}
	}, [columnTags, inputValue, newTagColor, hasCloseRequestTimeChange]);

	return (
		<div
			css={css`
				background-color: var(--background-primary);
			`}
		>
			<MenuHeader
				isMenuVisible={isMenuVisible}
				inputValue={inputValue}
				cellTags={cellTags}
				onInputValueChange={setInputValue}
				onRemoveTag={onRemoveTag}
			/>
			<MenuBody
				menuPosition={menuPosition}
				inputValue={inputValue}
				columnTags={columnTags}
				newTagColor={newTagColor}
				onTagAdd={handleTagAdd}
				onTagClick={onTagClick}
				onTagDelete={onTagDelete}
				onTagColorChange={onTagColorChange}
			/>
		</div>
	);
}
