import { css } from "@emotion/react";
import { Tag as TagType } from "src/shared/types/types";
import Tag from "src/react/shared/tag";
import Wrap from "src/react/shared/wrap";

import { useFocusMenuInput } from "src/shared/hooks";
import { getTableBackgroundColor, getTableBorderColor } from "src/shared/color";

interface MenuHeaderProps {
	isMenuVisible: boolean;
	cellTags: TagType[];
	inputValue: string;
	onInputValueChange: (value: string) => void;
	onRemoveTag: (tagId: string) => void;
}

export default function MenuHeader({
	isMenuVisible,
	cellTags,
	inputValue,
	onInputValueChange,
	onRemoveTag,
}: MenuHeaderProps) {
	const inputRef = useFocusMenuInput(
		isMenuVisible,
		inputValue,
		onInputValueChange
	);

	function handleInputChange(value: string) {
		// If the value starts with whitespace don't add the tag
		if (value.match(/^\s+$/)) return;
		onInputValueChange(value);
	}

	const tableBackgroundColor = getTableBackgroundColor();
	const tableBorderColor = getTableBorderColor();

	return (
		<div
			css={css`
				background-color: ${tableBackgroundColor};
				border-bottom: 1px solid ${tableBorderColor};
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
