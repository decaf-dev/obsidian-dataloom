import Button from "../button";
import Stack from "../stack";

interface Props {
	isFirstStep: boolean;
	isLastStep: boolean;
	isNextDisabled?: boolean;
	finishButtonLabel: string;
	onNextClick: () => void;
	onBackClick: () => void;
}

export default function StepButtons({
	isFirstStep,
	isLastStep,
	isNextDisabled,
	finishButtonLabel,
	onNextClick,
	onBackClick,
}: Props) {
	return (
		<div className="dataloom-step__buttons">
			<Stack isHorizontal spacing="md">
				<Button
					isDisabled={isNextDisabled}
					variant="default"
					onClick={onNextClick}
				>
					{isLastStep ? finishButtonLabel : "Next"}
				</Button>
				{!isFirstStep && <Button onClick={onBackClick}>Back</Button>}
			</Stack>
		</div>
	);
}
