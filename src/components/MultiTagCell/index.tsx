import Tag from "../Tag";

import { Tag as TagType } from "../../services/table/types";
import Wrap from "src/components/Wrap";

import "./styles.css";

interface Props {
	isDarkMode: boolean;
	tags: TagType[];
}
export default function MultiTagCell({ isDarkMode, tags }: Props) {
	return (
		<div className="NLT__multi-tag-cell">
			<Wrap>
				{tags.map((tag: TagType) => (
					<Tag
						key={tag.id}
						isDarkMode={isDarkMode}
						html={tag.html}
						color={tag.color}
					/>
				))}
			</Wrap>
		</div>
	);
}
