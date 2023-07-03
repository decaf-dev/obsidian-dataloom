import Tag from "src/react/shared/tag";

import { Color } from "src/shared/types";

import { css } from "@emotion/react";
import Stack from "src/react/shared/stack";

interface Props {
	markdown: string;
	color: Color;
	onTagAdd: (markdown: string, color: Color) => void;
}

export default function CreateTag({ markdown, color, onTagAdd }: Props) {
	return (
		<button
			css={css`
				all: unset; //reset button style
				display: flex;
				align-items: center;
				padding: 4px 6px;
				width: 100%;
				overflow: hidden;
			`}
			className="Dashboards__focusable Dashboards__selectable"
			onClick={() => onTagAdd(markdown, color)}
		>
			<Stack spacing="sm">
				<div>Create</div>
				<Tag markdown={markdown} color={color} maxWidth="120px" />
			</Stack>
		</button>
	);
}
