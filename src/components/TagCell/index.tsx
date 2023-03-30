import Tag from "../Tag";

import "./styles.css";
interface Props {
	isDarkMode: boolean;
	markdown: string;
	color: string;
}

export default function TagCell({ isDarkMode, markdown, color }: Props) {
	return (
		<div className="NLT__tag-cell">
			<Tag isDarkMode={isDarkMode} markdown={markdown} color={color} />
		</div>
	);
}
