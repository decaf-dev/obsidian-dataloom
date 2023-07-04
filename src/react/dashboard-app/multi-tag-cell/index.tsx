import Tag from "../../shared/tag";

import { Tag as TagType } from "../../../shared/types";
import Wrap from "src/react/shared/wrap";

import "./styles.css";
import { useOverflow } from "src/shared/spacing/hooks";

interface Props {
	cellTags: TagType[];
	shouldWrapOverflow: boolean;
}
export default function MultiTagCell({ cellTags, shouldWrapOverflow }: Props) {
	const overflowStyle = useOverflow(shouldWrapOverflow);
	return (
		<div className="Dashboards__multi-tag-cell" css={overflowStyle}>
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
