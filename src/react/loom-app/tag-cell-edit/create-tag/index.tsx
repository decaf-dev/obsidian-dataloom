import Tag from "src/react/shared/tag";
import Stack from "src/react/shared/stack";
import Button from "src/react/shared/button";

import { Color } from "src/shared/loom-state/types/loom-state";
import Padding from "src/react/shared/padding";

interface Props {
	markdown: string;
	color: Color;
	onTagAdd: (markdown: string, color: Color) => void;
}

export default function CreateTag({ markdown, color, onTagAdd }: Props) {
	return (
		<div className="dataloom-create-tag">
			<Button
				variant="text"
				isFullWidth
				onClick={() => onTagAdd(markdown, color)}
			>
				<Padding px="md">
					<Stack spacing="sm" isHorizontal>
						<div>Create</div>
						<Tag
							markdown={markdown}
							color={color}
							maxWidth="120px"
						/>
					</Stack>
				</Padding>
			</Button>
		</div>
	);
}
