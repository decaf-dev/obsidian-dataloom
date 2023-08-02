import React from "react";

import MenuHeader from "./menu-header";
import MenuBody from "./menu-body";

import { Tag as TagType } from "src/shared/loom-state/types";
import { Color } from "src/shared/loom-state/types";
import { randomColor } from "src/shared/color";

import { useCompare } from "src/shared/hooks";
import { MenuCloseRequest } from "src/shared/menu/types";

interface Props {
	isMulti: boolean;
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
	isMulti,
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
			if (!isMulti) onMenuClose();
		},
		[onTagAdd, onMenuClose]
	);

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);

	React.useEffect(() => {
		if (hasCloseRequestTimeChanged && menuCloseRequest !== null) {
			if (menuCloseRequest.type === "enter") {
				if (inputValue !== "") {
					const doesTagExist = columnTags.find(
						(tag) => tag.markdown === inputValue
					);
					if (!doesTagExist) {
						handleTagAdd(inputValue, newTagColor);
						return;
					}
				}
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
		if (!isMulti) onMenuClose();
	}

	return (
		<div className="dataloom-tag-cell-edit">
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
