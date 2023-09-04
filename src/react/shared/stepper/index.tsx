import React from "react";

import StepSpacer from "./step-spacer";
import StepContent from "./step-content";
import Stack from "../stack";
import StepButtons from "./step-buttons";
import StepHeader from "./step-header";
import StepSeparator from "./step-separator";

import { Step } from "./types";

import "./styles.css";

interface Props {
	steps: Step[];
	finishButtonLabel?: string;
	onFinishClick: () => void;
}

export default function Stepper({
	steps,
	finishButtonLabel = "Finish",
	onFinishClick,
}: Props) {
	const [activeIndex, setActiveIndex] = React.useState(0);
	const activeStep = steps[activeIndex];

	function handleStepHeaderClick(index: number) {
		for (let i = index; i < activeIndex; i++) {
			steps[i].onBack?.();
		}
		setActiveIndex(index);
	}

	function handleNextClick() {
		if (activeIndex === steps.length - 1) {
			onFinishClick();
			return;
		}
		if (activeStep.onContinue) {
			if (activeStep.onContinue() === false) return;
		}
		setActiveIndex((prevState) => prevState + 1);
	}

	function handleBackClick() {
		if (activeIndex === 0) return;
		if (activeStep.onBack) activeStep.onBack();
		setActiveIndex((prevState) => prevState - 1);
	}

	const isFirstStep = activeIndex === 0;
	const isLastStep = activeIndex === steps.length - 1;

	return (
		<div className="dataloom-stepper">
			{steps.map((step, i) => {
				const {
					title,
					description,
					content,
					canContinue = true,
				} = step;

				return (
					<div key={i} className="dataloom-step">
						<StepHeader
							title={title}
							description={description}
							index={i}
							activeIndex={activeIndex}
							onClick={handleStepHeaderClick}
						/>
						{i === activeIndex && (
							<Stack isHorizontal>
								<StepSeparator hideBorder={isLastStep} />
								<Stack spacing="lg" width="100%">
									<StepContent
										content={content}
										addTopMargin={description !== undefined}
									/>
									<StepButtons
										isNextDisabled={
											canContinue instanceof Function
												? !canContinue()
												: !canContinue
										}
										isFirstStep={isFirstStep}
										isLastStep={isLastStep}
										finishButtonLabel={finishButtonLabel}
										onNextClick={handleNextClick}
										onBackClick={handleBackClick}
									/>
								</Stack>
							</Stack>
						)}
						{i < steps.length - 1 && <StepSpacer />}
					</div>
				);
			})}
		</div>
	);
}
