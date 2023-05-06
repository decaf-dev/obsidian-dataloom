import Tag from "src/react/shared/tag";

import { Color } from "src/shared/types";

import { css } from "@emotion/react";

interface Props {
	markdown: string;
	color: Color;
	onAddTag: (markdown: string, color: Color) => void;
}

export default function CreateTag({ markdown, color, onAddTag }: Props) {
	return (
		<div
			css={css`
				display: flex;
				align-items: center;
				padding: 4px 6px;
				width: 100%;
				overflow: hidden;
			`}
			className="NLT__selectable"
			onClick={() => {
				onAddTag(markdown, color);
			}}
		>
			<div>Create&nbsp;</div>
			<Tag markdown={markdown} color={color} maxWidth="120px" />
		</div>
	);
}
