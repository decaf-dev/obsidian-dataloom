import Tag from "../../../Tag";

import { Tag as TagType } from "../../../../services/tableState/types";
import Wrap from "src/components/Wrap";

import "./styles.css";
import { useOverflowClassName } from "src/services/spacing/hooks";

interface Props {
	isDarkMode: boolean;
	tags: TagType[];
	shouldWrapOverflow: boolean;
}
export default function MultiTagCell({
	isDarkMode,
	tags,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__multi-tag-cell" + " " + overflowClassName;
	return (
		<div className={className}>
			<Wrap>
				{tags.map((tag: TagType) => (
					<Tag
						key={tag.id}
						isDarkMode={isDarkMode}
						markdown={tag.markdown}
						color={tag.color}
					/>
				))}
			</Wrap>
		</div>
	);
}
