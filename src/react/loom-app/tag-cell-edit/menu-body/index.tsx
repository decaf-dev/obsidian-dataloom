import Padding from "src/react/shared/padding";
import Text from "src/react/shared/text";
import { Color } from "src/shared/loom-state/types/loom-state";
import { Tag } from "src/shared/loom-state/types/loom-state";
import CreateTag from "../create-tag";
import SelectableTag from "../selectable-tag";

import "./styles.css";

interface MenuBodyProps {
	columnTags: Tag[];
	inputValue: string;
	newTagColor: Color;
	onTagAdd: (markdown: string, color: Color) => void;
	onTagClick: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: Color) => void;
	onTagDelete: (tagId: string) => void;
	onTagContentChange: (tagId: string, value: string) => void;
}

export default function MenuBody({
	columnTags,
	inputValue,
	newTagColor,
	onTagAdd,
	onTagClick,
	onTagColorChange,
	onTagDelete,
	onTagContentChange,
}: MenuBodyProps) {
	const hasTagWithSameCase =
		columnTags.find((tag) => tag.content === inputValue) !== undefined;
	const filteredTags = columnTags.filter((tag) =>
		tag.content.toLowerCase().includes(inputValue.toLowerCase())
	);

	return (
		<div className="dataloom-tag-cell-edit__menu-body">
			<Padding px="lg" py="md">
				<Text value="Select a tag or create one" />
			</Padding>
			<div className="dataloom-tag-cell-edit__menu-body-container">
				{!hasTagWithSameCase && inputValue !== "" && (
					<CreateTag
						content={inputValue}
						color={newTagColor}
						onTagAdd={onTagAdd}
					/>
				)}
				{filteredTags.map((tag) => (
					<SelectableTag
						key={tag.id}
						id={tag.id}
						color={tag.color}
						content={tag.content}
						onColorChange={onTagColorChange}
						onClick={onTagClick}
						onDeleteClick={onTagDelete}
						onTagContentChange={onTagContentChange}
					/>
				))}
			</div>
		</div>
	);
}
