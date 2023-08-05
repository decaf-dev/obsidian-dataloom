import Tag from "src/react/shared/tag";

import { Color } from "src/shared/loom-state/types";

import Stack from "src/react/shared/stack";

import "./styles.css";

interface Props {
	markdown: string;
	color: Color;
	onTagAdd: (markdown: string, color: Color) => void;
}

export default function CreateTag({ markdown, color, onTagAdd }: Props) {
	return (
		<button
			className="dataloom-create-tag dataloom-focusable dataloom-selectable"
			onClick={() => onTagAdd(markdown, color)}
		>
			<Stack spacing="sm" isHorizontal>
				<div>Create</div>
				<Tag markdown={markdown} color={color} maxWidth="120px" />
			</Stack>
		</button>
	);
}
