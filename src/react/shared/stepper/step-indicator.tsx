import Flex from "../flex";
import Icon from "../icon";
import Text from "../text";

interface Props {
	index: number;
	activeStep: number;
}

export default function StepIndicator({ index, activeStep }: Props) {
	return (
		<div className="dataloom-step__indicator">
			<Flex justify="center" align="center" height="100%">
				{activeStep > index ? (
					<Icon lucideId="checkmark" />
				) : (
					<Text value={index + 1} />
				)}
			</Flex>
		</div>
	);
}
