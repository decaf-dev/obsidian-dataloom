import { IconType } from "src/services/icon/types";
import Button from "src/components/Button";
import { SortDir } from "src/services/tableState/types";
import Stack from "src/components/Stack";
import Icon from "src/components/Icon";

interface SortBubbleProps {
	sortDir: SortDir;
	markdown: string;
	isDarkMode: boolean;
	onRemoveClick: () => void;
}

export default function SortBubble({
	isDarkMode,
	sortDir,
	markdown,
	onRemoveClick,
}: SortBubbleProps) {
	return (
		<div className="NLT__sort-bubble">
			<Stack spacing="lg">
				<Stack spacing="sm">
					{sortDir === SortDir.ASC ? (
						<Icon icon={IconType.ARROW_UPWARD} />
					) : (
						<Icon icon={IconType.ARROW_DOWNWARD} />
					)}
					<span>{markdown}</span>
				</Stack>
				<Button
					icon={<Icon icon={IconType.CLOSE} />}
					onClick={onRemoveClick}
				/>
			</Stack>
		</div>
	);
}
