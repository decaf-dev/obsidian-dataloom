import React from "react";

import Tag from "src/react/shared/tag";
import Wrap from "src/react/shared/wrap";
import Input from "src/react/shared/input";

import { Tag as TagType } from "src/shared/loom-state/types";
import Padding from "src/react/shared/padding";

interface MenuHeaderProps {
	cellTags: TagType[];
	inputValue: string;
	onInputValueChange: (value: string) => void;
	onRemoveTag: (tagId: string) => void;
}

export default function MenuHeader({
	cellTags,
	inputValue,
	onInputValueChange,
	onRemoveTag,
}: MenuHeaderProps) {
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	function handleInputChange(value: string) {
		if (value.match(/^\s/)) return;
		//Trim white space when we're adding it
		onInputValueChange(value);
	}

	return (
		<div className="dataloom-tag-cell-edit__menu-header">
			<Padding px="md" pt="md" pb="sm">
				<Wrap spacingX="sm">
					{cellTags.map((tag) => (
						<Tag
							key={tag.id}
							id={tag.id}
							color={tag.color}
							markdown={tag.markdown}
							maxWidth="150px"
							showRemoveButton
							onRemoveClick={onRemoveTag}
						/>
					))}
				</Wrap>
			</Padding>
			<Padding p="md">
				<Input
					ref={inputRef}
					isTransparent
					value={inputValue}
					onChange={handleInputChange}
				/>
			</Padding>
		</div>
	);
}
