import Tag from "../../shared/tag";

import { Tag as TagType } from "../../../shared/types/types";
import Wrap from "src/react/shared/wrap";

import "./styles.css";
import { useOverflowClassName } from "src/shared/spacing/hooks";

interface Props {
	cellTags: TagType[];
	shouldWrapOverflow: boolean;
}
export default function MultiTagCell({ cellTags, shouldWrapOverflow }: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__multi-tag-cell" + " " + overflowClassName;
	return (
		<div className={className}>
			<Wrap>
				{cellTags.map((tag: TagType) => (
					<Tag
						key={tag.id}
						markdown={tag.markdown}
						color={tag.color}
					/>
				))}
			</Wrap>
		</div>
	);
}
