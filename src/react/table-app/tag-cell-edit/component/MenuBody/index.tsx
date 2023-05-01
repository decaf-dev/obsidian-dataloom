import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Text from "src/react/shared/text";
import { Color } from "src/shared/types";
import { Tag } from "src/data/types";
import CreateTag from "../CreateTag";
import SelectableTag from "../SelectableTag";

import "./styles.css";
import { MenuPosition } from "src/redux/menu/types";

interface MenuBodyProps {
	isDarkMode: boolean;
	tags: Tag[];
	menuPosition: MenuPosition;
	inputText: string;
	newTagColor: Color;
	onAddTag: (markdown: string, color: Color) => void;
	onTagClick: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: Color) => void;
	onTagDeleteClick: (tagId: string) => void;
}

export default function MenuBody({
	isDarkMode,
	tags,
	inputText,
	menuPosition,
	newTagColor,
	onAddTag,
	onTagClick,
	onTagColorChange,
	onTagDeleteClick,
}: MenuBodyProps) {
	const found = tags.find((tag) => tag.markdown === inputText);
	const filteredTags = tags.filter((tag) => tag.markdown.includes(inputText));
	return (
		<div className="NLT__tag-menu-body">
			<Padding px="lg" py="md">
				<Text value="Select an option or create one" />
			</Padding>
			<div style={{ width: "100%" }}>
				{!found && inputText !== "" && (
					<CreateTag
						isDarkMode={isDarkMode}
						markdown={inputText}
						color={newTagColor}
						onAddTag={onAddTag}
					/>
				)}
				{filteredTags.map((tag) => (
					<SelectableTag
						isDarkMode={isDarkMode}
						menuPosition={menuPosition}
						key={tag.id}
						id={tag.id}
						color={tag.color}
						markdown={tag.markdown}
						onColorChange={onTagColorChange}
						onClick={onTagClick}
						onDeleteClick={onTagDeleteClick}
					/>
				))}
			</div>
		</div>
	);
}
