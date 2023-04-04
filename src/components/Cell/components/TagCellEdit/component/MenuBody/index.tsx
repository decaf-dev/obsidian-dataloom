import Text from "src/components/Text";
import { Color } from "src/services/color/types";
import { Tag } from "src/services/tableState/types";
import CreateTag from "../CreateTag";
import SelectableTag from "../SelectableTag";

import "./styles.css";

interface MenuBodyProps {
	isDarkMode: boolean;
	tags: Tag[];
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
			<Text value="Select an option or create one" />
			<div
				style={{
					overflowY: "scroll",
					height: "140px",
				}}
			>
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
