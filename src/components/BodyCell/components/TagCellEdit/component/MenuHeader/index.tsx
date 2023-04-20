import { Tag as TagType } from "src/services/tableState/types";
import Tag from "src/components/Tag";
import Wrap from "src/components/Wrap";

import "./styles.css";

interface MenuHeaderProps {
	isDarkMode: boolean;
	cellId: string;
	tags: TagType[];
	inputText: string;
	onInputTextChange: (value: string) => void;
	onRemoveTag: (tagId: string) => void;
}

export default function MenuHeader({
	isDarkMode,
	cellId,
	tags,
	inputText,
	onInputTextChange,
	onRemoveTag,
}: MenuHeaderProps) {
	return (
		<div className="NLT__tag-menu-header">
			<Wrap spacingX="sm">
				{tags
					.filter((tag) => tag.cellIds.find((c) => c === cellId))
					.map((tag) => (
						<Tag
							isDarkMode={isDarkMode}
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
					type="text"
					value={inputText}
					onChange={(e) => onInputTextChange(e.target.value)}
				/>
			</Wrap>
		</div>
	);
}
