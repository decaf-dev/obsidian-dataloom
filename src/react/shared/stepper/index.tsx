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
	const [activeStep, setActiveStep] = React.useState(0);

	function handleNextClick() {
		if (activeStep === steps.length - 1) {
			onFinishClick();
			return;
		}
		setActiveStep((prevState) => prevState + 1);
	}

	function handleBackClick() {
		if (activeStep === 0) return;
		setActiveStep((prevState) => prevState - 1);
	}

	const isLastStep = activeStep === steps.length - 1;

	return (
		<div className="dataloom-stepper">
			{steps.map((step, i) => {
				const { title, description, content, isContinueDisabled } =
					step;
				return (
					<div key={i} className="dataloom-step">
						<StepHeader
							title={title}
							description={description}
							index={i}
							activeStep={activeStep}
						/>
						{i === activeStep && (
							<Stack isHorizontal>
								<StepSeparator hideBorder={isLastStep} />
								<Stack spacing="lg">
									<StepContent
										content={content}
										addTopMargin={description !== undefined}
									/>
									<StepButtons
										isContinueDisabled={isContinueDisabled}
										isLastStep={isLastStep}
										finishButtonLabel={finishButtonLabel}
										onBackClick={handleBackClick}
										onNextClick={handleNextClick}
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
