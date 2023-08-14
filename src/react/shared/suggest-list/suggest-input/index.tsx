import Input from "../../input";

import "./styles.css";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function SuggestInput({ value, onChange }: Props) {
	return (
		<div className="dataloom-suggest-input">
			<Input
				isTransparent
				focusOutline="none"
				placeholder="Search for a file..."
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}
