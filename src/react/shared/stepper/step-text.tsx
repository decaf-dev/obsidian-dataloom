import Text from "../text";
import Stack from "../stack";

interface Props {
	title: string;
	description?: string;
	isComplete: boolean;
	onClick: () => void;
}

export default function StepText({
	title,
	description,
	isComplete,
	onClick,
}: Props) {
	function handleClick() {
		if (!isComplete) return;
		onClick();
	}

	let className = "dataloom-step__text";
	if (isComplete) {
		className += " dataloom-step__text--complete";
	}
	return (
		<div className={className}>
			<Stack spacing="sm" onClick={handleClick}>
				<Text variant="semibold" size="lg" value={title} />
				{description && <Text size="md" value={description} />}
			</Stack>
		</div>
	);
}
