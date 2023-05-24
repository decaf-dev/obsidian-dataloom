import Padding from "src/react/shared/padding";
import Text from "src/react/shared/text";
import { Color } from "src/shared/types/types";
import { Tag } from "src/shared/types/types";
import CreateTag from "./create-tag";
import SelectableTag from "./selectable-tag";

import { MenuPosition } from "src/shared/menu/types";
import { css } from "@emotion/react";

interface MenuBodyProps {
	columnTags: Tag[];
	menuPosition: MenuPosition;
	inputValue: string;
	newTagColor: Color;
	onTagAdd: (markdown: string, color: Color) => void;
	onTagClick: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: Color) => void;
	onTagDelete: (tagId: string) => void;
}

export default function MenuBody({
	columnTags,
	inputValue,
	menuPosition,
	newTagColor,
	onTagAdd,
	onTagClick,
	onTagColorChange,
	onTagDelete,
}: MenuBodyProps) {
	const tagWithSameCase = columnTags.find(
		(tag) => tag.markdown === inputValue
	);
	const filteredTags = columnTags.filter((tag) =>
		tag.markdown.toLowerCase().includes(inputValue.toLowerCase())
	);

	return (
		<div
			css={css`
				max-height: 140px;
				overflow-y: scroll;
			`}
		>
			<Padding px="lg" py="md">
				<Text value="Select an option or create one" />
			</Padding>
			<div
				css={css`
					width: 100%;
				`}
			>
				{tagWithSameCase === undefined && inputValue !== "" && (
					<CreateTag
						markdown={inputValue}
						color={newTagColor}
						onTagAdd={onTagAdd}
					/>
				)}
				{filteredTags.map((tag) => (
					<SelectableTag
						menuPosition={menuPosition}
						key={tag.id}
						id={tag.id}
						color={tag.color}
						markdown={tag.markdown}
						onColorChange={onTagColorChange}
						onClick={onTagClick}
						onDeleteClick={onTagDelete}
					/>
				))}
			</div>
		</div>
	);
}
