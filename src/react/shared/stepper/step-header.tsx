import Stack from "../stack";
import Text from "../text";
import StepIndicator from "./step-indicator";

interface Props {
	title: string;
	description?: string;
	index: number;
	activeStep: number;
}

export default function StepHeader({
	title,
	description,
	index,
	activeStep,
}: Props) {
	let className = "dataloom-step__header";
	if (description === undefined) {
		className += " dataloom-step__header--margin";
	}
	return (
		<div className={className}>
			<Stack isHorizontal>
				<StepIndicator index={index} activeStep={activeStep} />
				<Stack spacing="sm">
					<Text variant="semibold" value={title} />
					{description && <Text size="sm" value={description} />}
				</Stack>
			</Stack>
		</div>
	);
}
