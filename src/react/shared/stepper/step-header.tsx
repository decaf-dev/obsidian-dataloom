import Stack from "../stack";
import StepIndicator from "./step-indicator";
import StepText from "./step-text";

interface Props {
	title: string;
	description?: string;
	index: number;
	activeIndex: number;
	onClick: (index: number) => void;
}

export default function StepHeader({
	title,
	description,
	index,
	activeIndex,
	onClick,
}: Props) {
	let className = "dataloom-step__header";
	if (description === undefined) {
		className += " dataloom-step__header--margin-bottom";
	}
	const isComplete = activeIndex > index;
	return (
		<div className={className}>
			<Stack isHorizontal>
				<StepIndicator
					index={index}
					isComplete={isComplete}
					onClick={() => onClick(index)}
				/>
				<StepText
					title={title}
					description={description}
					isComplete={isComplete}
					onClick={() => onClick(index)}
				/>
			</Stack>
		</div>
	);
}
