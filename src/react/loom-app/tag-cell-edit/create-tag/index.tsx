import Tag from "src/react/shared/tag";
import Stack from "src/react/shared/stack";
import Button from "src/react/shared/button";

import { Color } from "src/shared/loom-state/types/loom-state";
import Padding from "src/react/shared/padding";

interface Props {
	content: string;
	color: Color;
	onTagAdd: (content: string, color: Color) => void;
}

export default function CreateTag({ content, color, onTagAdd }: Props) {
	return (
		<div className="dataloom-create-tag">
			<Button
				variant="text"
				isFullWidth
				onClick={() => onTagAdd(content, color)}
			>
				<Padding px="md">
					<Stack spacing="sm" isHorizontal>
						<div>Create</div>
						<Tag content={content} color={color} maxWidth="120px" />
					</Stack>
				</Padding>
			</Button>
		</div>
	);
}
