import { Tag as TagType } from "src/data/types";
import Tag from "src/react/shared/tag";
import Wrap from "src/react/shared/wrap";

import { useFocusMenuInput } from "src/shared/hooks";

interface MenuHeaderProps {
	cellId: string;
	isMenuVisible: boolean;
	tags: TagType[];
	inputValue: string;
	onInputValueChange: (value: string) => void;
	onRemoveTag: (tagId: string) => void;
}

export default function MenuHeader({
	isMenuVisible,
	cellId,
	tags,
	inputValue,
	onInputValueChange,
	onRemoveTag,
}: MenuHeaderProps) {
	const inputRef = useFocusMenuInput(
		isMenuVisible,
		inputValue,
		onInputValueChange
	);

	return (
		<div className="NLT__tag-menu-header">
			<Wrap spacingX="sm">
				{tags
					.filter((tag) => tag.cellIds.find((c) => c === cellId))
					.map((tag) => (
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
					autoFocus
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => onInputValueChange(e.target.value)}
				/>
			</Wrap>
		</div>
	);
}
