import Text from "../Text";

import "./styles.css";

interface Props {}

export default function FunctionCell({}: Props) {
	return (
		<div className="NLT__function-cell">
			<Text value="Calculate" variant="faint" />
		</div>
	);
}
