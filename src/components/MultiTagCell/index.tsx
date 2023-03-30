import Tag from "../Tag";

import { Tag as TagType } from "../../services/tableState/types";
import Wrap from "src/components/Wrap";

import "./styles.css";

interface Props {
	isDarkMode: boolean;
	tags: TagType[];
	markdown: string;
}
export default function MultiTagCell({ isDarkMode, markdown, tags }: Props) {
	return (
		<div className="NLT__multi-tag-cell">
			<Wrap>
				{tags.map((tag: TagType) => (
					<Tag
						key={tag.id}
						isDarkMode={isDarkMode}
						markdown={markdown}
						color={tag.color}
					/>
				))}
			</Wrap>
		</div>
	);
}
