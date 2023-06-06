import { css } from "@emotion/react";
import { Tag as TagType } from "src/shared/types/types";
import Tag from "src/react/shared/tag";
import Wrap from "src/react/shared/wrap";

import React from "react";

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
		<div
			css={css`
				background-color: var(--background-secondary);
				border-bottom: 1px solid var(--table-border-color);
				padding: 4px 10px;
			`}
		>
			<Wrap spacingX="sm">
				{cellTags.map((tag) => (
					<Tag
						key={tag.id}
						id={tag.id}
						color={tag.color}
						markdown={tag.markdown}
						maxWidth="150px"
						showRemove
						onRemoveClick={onRemoveTag}
					/>
				))}
				<input
					css={css`
						background-color: transparent !important;
						border: 0 !important;
						box-shadow: none !important;
						width: 100%;
						padding-left: 5px !important;
						padding-right: 5px !important;
					`}
					autoFocus
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => handleInputChange(e.target.value)}
				/>
			</Wrap>
		</div>
	);
}
