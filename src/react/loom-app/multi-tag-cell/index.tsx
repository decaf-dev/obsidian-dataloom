import Tag from "../../shared/tag";

import { Tag as TagType } from "../../../shared/loom-state/types/loom-state";
import Wrap from "src/react/shared/wrap";

import "./styles.css";
import { useOverflow } from "src/shared/spacing/hooks";

interface Props {
	cellTags: TagType[];
	shouldWrapOverflow: boolean;
}
export default function MultiTagCell({ cellTags, shouldWrapOverflow }: Props) {
	const overflowClassName = useOverflow(shouldWrapOverflow);

	let className = "dataloom-multi-tag-cell";
	className += " " + overflowClassName;
	return (
		<div className={className}>
			<Wrap>
				{cellTags.map((tag: TagType) => (
					<Tag key={tag.id} content={tag.content} color={tag.color} />
				))}
			</Wrap>
		</div>
	);
}
