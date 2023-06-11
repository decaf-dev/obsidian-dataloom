import React from "react";

import MenuHeader from "./menu-header";
import MenuBody from "./menu-body";

import { Tag as TagType } from "src/shared/types";
import { Color } from "src/shared/types";
import { randomColor } from "src/shared/color";

import { useCompare } from "src/shared/hooks";
import { MenuCloseRequest } from "src/shared/menu/types";

interface Props {
	columnTags: TagType[];
	cellTags: TagType[];
	menuCloseRequest: MenuCloseRequest | null;
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
	menuCloseRequest,
	onTagClick,
	onTagAdd,
	onTagColorChange,
	onTagDelete,
	onRemoveTag,
	onMenuClose,
}: Props) {
	const [inputValue, setInputValue] = React.useState("");
	const [newTagColor, setNewTagColor] = React.useState(randomColor());

	const handleTagAdd = React.useCallback(
		(markdown: string, color: Color) => {
			onTagAdd(markdown, color);
			setInputValue("");
			setNewTagColor(randomColor());
			onMenuClose();
		},
		[onTagAdd, onMenuClose]
	);

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);

	React.useEffect(() => {
		if (hasCloseRequestTimeChanged && menuCloseRequest !== null) {
			if (menuCloseRequest.type === "enter") {
				const shouldAddTag =
					columnTags.find((tag) => tag.markdown === inputValue) ===
					undefined;
				if (shouldAddTag) handleTagAdd(inputValue, newTagColor);
			}
			onMenuClose();
		}
	}, [
		handleTagAdd,
		columnTags,
		inputValue,
		newTagColor,
		hasCloseRequestTimeChanged,
		menuCloseRequest,
		onMenuClose,
	]);

	function handleTagClick(id: string) {
		onTagClick(id);
		onMenuClose();
	}

	return (
		<div className="NLT__tag-cell-edit">
			<MenuHeader
				inputValue={inputValue}
				cellTags={cellTags}
				onInputValueChange={setInputValue}
				onRemoveTag={onRemoveTag}
			/>
			<MenuBody
				inputValue={inputValue}
				columnTags={columnTags}
				newTagColor={newTagColor}
				onTagAdd={handleTagAdd}
				onTagClick={handleTagClick}
				onTagDelete={onTagDelete}
				onTagColorChange={onTagColorChange}
			/>
		</div>
	);
}
