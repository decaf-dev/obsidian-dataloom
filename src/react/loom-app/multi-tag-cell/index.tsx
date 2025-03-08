import Wrap from "src/react/shared/wrap";
import Tag from "../../shared/tag";

import { type Tag as TagType } from "../../../shared/loom-state/types/loom-state";

import "./styles.css";

interface Props {
	cellTags: TagType[];
}

export default function MultiTagCell({ cellTags }: Props) {
	return (
		<div className="dataloom-multi-tag-cell">
			<Wrap>
				{cellTags.map((tag: TagType) => (
					<Tag key={tag.id} content={tag.content} color={tag.color} />
				))}
			</Wrap>
		</div>
	);
}
