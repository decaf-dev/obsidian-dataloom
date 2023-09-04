import Flex from "../flex";
import Icon from "../icon";
import Text from "../text";

interface Props {
	index: number;
	isComplete: boolean;
	onClick: () => void;
}

export default function StepIndicator({ index, isComplete, onClick }: Props) {
	function handleClick() {
		if (!isComplete) return;
		onClick();
	}

	let className = "dataloom-step__indicator";
	if (isComplete) {
		className += " dataloom-step__indicator--complete";
	}
	return (
		<div className={className} onClick={handleClick}>
			<Flex justify="center" align="center" height="100%">
				{isComplete ? (
					<Icon lucideId="checkmark" size="lg" />
				) : (
					<Text value={index + 1} variant="semibold" size="lg" />
				)}
			</Flex>
		</div>
	);
}
