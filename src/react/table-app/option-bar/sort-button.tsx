import { Button } from "src/react/shared/button";
import { SortDir } from "src/data/types";
import Stack from "src/react/shared/stack";
import Icon from "src/react/shared/icon";
import { IconType } from "src/react/shared/icon/types";

interface SortBubbleProps {
	sortDir: SortDir;
	markdown: string;
	onRemoveClick: () => void;
}

export default function SortBubble({
	sortDir,
	markdown,
	onRemoveClick,
}: SortBubbleProps) {
	return (
		<div className="NLT__sort-bubble">
			<Stack spacing="lg">
				<Stack spacing="sm">
					{sortDir === SortDir.ASC ? (
						<Icon type={IconType.ARROW_UPWARD} />
					) : (
						<Icon type={IconType.ARROW_DOWNWARD} />
					)}
					<span>{markdown}</span>
				</Stack>
				<Button
					icon={<Icon type={IconType.CLOSE} />}
					isSimple
					onClick={onRemoveClick}
				/>
			</Stack>
		</div>
	);
}
