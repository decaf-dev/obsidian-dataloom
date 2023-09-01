import Flex from "../flex";
import Icon from "../icon";
import Text from "../text";

interface Props {
	index: number;
	activeIndex: number;
}

export default function StepIndicator({ index, activeIndex }: Props) {
	return (
		<div className="dataloom-step__indicator">
			<Flex justify="center" align="center" height="100%">
				{activeIndex > index ? (
					<Icon lucideId="checkmark" />
				) : (
					<Text value={index + 1} />
				)}
			</Flex>
		</div>
	);
}
