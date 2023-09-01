import Button from "../button";
import Stack from "../stack";

interface Props {
	isLastStep: boolean;
	finishButtonLabel: string;
	onNextClick: () => void;
	onBackClick: () => void;
}

export default function StepButtons({
	isLastStep,
	finishButtonLabel,
	onNextClick,
	onBackClick,
}: Props) {
	return (
		<div className="dataloom-step__buttons">
			<Stack isHorizontal spacing="md">
				<Button variant="default" onClick={onNextClick}>
					{isLastStep ? finishButtonLabel : "Continue"}
				</Button>
				<Button onClick={onBackClick}>Back</Button>
			</Stack>
		</div>
	);
}
