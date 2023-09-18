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
	onTagNameChange: (tagId: string, value: string) => void;
}

export default function MenuBody({
	columnTags,
	inputValue,
	newTagColor,
	onTagAdd,
	onTagClick,
	onTagColorChange,
	onTagDelete,
	onTagNameChange,
}: MenuBodyProps) {
	const hasTagWithSameCase =
		columnTags.find((tag) => tag.markdown === inputValue) !== undefined;
	const filteredTags = columnTags.filter((tag) =>
		tag.markdown.toLowerCase().includes(inputValue.toLowerCase())
	);

	return (
		<div className="dataloom-tag-cell-edit__menu-body">
			<Padding px="lg" py="md">
				<Text value="Select a tag or create one" />
			</Padding>
			<div className="dataloom-tag-cell-edit__menu-body-container">
				{!hasTagWithSameCase && inputValue !== "" && (
					<CreateTag
						markdown={inputValue}
						color={newTagColor}
						onTagAdd={onTagAdd}
					/>
				)}
				{filteredTags.map((tag) => (
					<SelectableTag
						key={tag.id}
						id={tag.id}
						color={tag.color}
						markdown={tag.markdown}
						onColorChange={onTagColorChange}
						onClick={onTagClick}
						onDeleteClick={onTagDelete}
						onTagNameChange={onTagNameChange}
					/>
				))}
			</div>
		</div>
	);
}
