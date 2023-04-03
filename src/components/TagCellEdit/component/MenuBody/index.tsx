import { Tag } from "src/services/tableState/types";
import CreateTag from "../CreateTag";
import SelectableTag from "../SelectableTag";

import "./styles.css";

interface MenuBodyProps {
	isDarkMode: boolean;
	tags: Tag[];
	inputText: string;
	generatedColor: string;
	onAddTag: (markdown: string, color: string) => void;
	onTagClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function MenuBody({
	isDarkMode,
	tags,
	inputText,
	generatedColor,
	onAddTag,
	onTagClick,
	onColorChange,
}: MenuBodyProps) {
	const found = tags.find((tag) => tag.markdown === inputText);
	const filteredTags = tags.filter((tag) => tag.markdown.includes(inputText));
	return (
		<div className="NLT__tag-menu-body">
			<p className="NLT__tag-menu-text">Select an option or create one</p>
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
						color={generatedColor}
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
						onColorChange={onColorChange}
						onClick={onTagClick}
					/>
				))}
			</div>
		</div>
	);
}
