import Padding from "src/react/shared/padding";
import Text from "src/react/shared/text";
import { Color } from "src/shared/types";
import { Tag } from "src/data/types";
import CreateTag from "./create-tag";
import SelectableTag from "./selectable-tag";

import { MenuPosition } from "src/shared/menu/types";
import { css } from "@emotion/react";

interface MenuBodyProps {
	tags: Tag[];
	menuPosition: MenuPosition;
	inputValue: string;
	newTagColor: Color;
	onTagAdd: (markdown: string, color: Color) => void;
	onTagClick: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: Color) => void;
	onTagDelete: (tagId: string) => void;
}

export default function MenuBody({
	tags,
	inputValue,
	menuPosition,
	newTagColor,
	onTagAdd,
	onTagClick,
	onTagColorChange,
	onTagDelete,
}: MenuBodyProps) {
	const found = tags.find((tag) => tag.markdown === inputValue);
	const filteredTags = tags.filter((tag) =>
		tag.markdown.includes(inputValue)
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
				{!found && inputValue !== "" && (
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
